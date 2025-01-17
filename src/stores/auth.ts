import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  getAdditionalUserInfo,
  type User,
  type Unsubscribe,
  isSignInWithEmailLink,
  signInWithEmailLink,
  type UserCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { sendSignInLinkToEmail, linkWithCredential } from 'firebase/auth';
import type { Nullable } from '@babylonjs/core';

import { useRemoteDBStore } from './remote';
import { useBroadcastStore } from './broadcast';
import * as local from '@/database/driver';
import { app, remoteDB } from '@/config/firebase';
import { type Profile, type AuthStatus, type AuthType } from '@/types';
import { useNotificationStore } from './notification';
import { Notifications } from '@/utils/constants';

const auth = getAuth(app);
auth.useDeviceLanguage();

export const useAuthStore = defineStore('auth', () => {
  const remote = useRemoteDBStore();
  const broadcast = useBroadcastStore();
  const notify = useNotificationStore();
  const user = ref<Nullable<User>>(null);
  const profile = ref<Nullable<Profile>>(null);
  const status = ref<AuthStatus>('pending');
  const unsubFn = ref<Nullable<Unsubscribe>>(null);
  const stateCheck = ref(false);

  function registerAuthListener() {
    if (unsubFn.value) return;

    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        user.value = usr;
        if (status.value !== 'signed-in') {
          await handleExistingUser(user.value);
          if (!window.location.href.includes('tankSignIntype=upgrade')) {
            status.value = 'signed-in';
          }
        }
      } else {
        if (status.value !== 'blocked') status.value = 'signed-out';
      }
      stateCheck.value = true;
    });
    unsubFn.value = unsubscribe;
  }
  function deRegisterAuthListener() {
    unsubFn.value?.();
  }
  async function updateUserProfile(prfl: Profile) {
    await remote.updateProfile(prfl);
  }
  async function loadUserProfile(uid: string) {
    const snap = await getDoc(doc(remoteDB, 'users', uid));
    profile.value = snap.data() as Profile;
  }
  async function handleNewUser(usr: User, username: string | null = null, isUpgrade = false) {
    let prfl: Profile;
    if (isUpgrade) {
      prfl = {
        id: usr.uid,
        username,
        email: usr.email
      };
    } else {
      prfl = {
        id: usr.uid,
        username,
        email: usr.email,
        stats: { matches: 0, wins: 0, points: 0 }
      };
    }

    await remote.storeProfile(prfl);
    await local.updateProfile(prfl);
    profile.value = prfl;
  }
  async function handleExistingUser(usr: User) {
    await loadUserProfile(usr.uid);
  }
  async function signIn(
    type: AuthType,
    email: string | null,
    link?: string,
    isUpgrade: boolean = false
  ): Promise<boolean> {
    status.value = 'pending';
    try {
      if (type === 'email' && email) {
        window.localStorage.setItem('email', email);
        await sendSignInLinkToEmail(auth, email, {
          url: `${window.location.protocol}//${window.location.host}?tankSignIntype=${isUpgrade ? 'upgrade' : 'init'}`,
          handleCodeInApp: true
        });
      } else if (type === 'verify') {
        if (link && isSignInWithEmailLink(auth, link)) {
          if (!email) {
            status.value = 'blocked';
            return false;
          } else {
            await handleSignInWithEmailLink(email, link);
            status.value = 'verified';
          }
        } else return false;
      } else if (type === 'guest') {
        await handleSignInWithAnonymous();
      } else if (type === 'guest-verify') {
        if (link && isSignInWithEmailLink(auth, link)) {
          if (!email || !user.value) {
            status.value = 'blocked';
            return false;
          } else {
            const credential = EmailAuthProvider.credentialWithLink(email, link);
            const { user: usr } = await linkWithCredential(user.value, credential);
            user.value = usr;
            await handleNewUser(usr, profile.value?.username, true);
            status.value = 'verified';
            broadcast.sendBroadcast({ type: 'auth', value: 'guest-verified' });
          }
        } else return false;
      }
      return true;
    } catch (error) {
      notify.push(Notifications.SIGN_IN_FAILED({ error }));
    }
    return false;
  }
  async function handleSignInWithEmailLink(email: string, link: string) {
    window.localStorage.removeItem('email');
    const result = await signInWithEmailLink(auth, email, link);
    await handleSignInSuccess(result);
  }
  async function handleSignInWithAnonymous() {
    const result = await signInAnonymously(auth);
    await handleSignInSuccess(result);
  }
  async function handleSignInSuccess(result?: UserCredential) {
    if (result) {
      if (getAdditionalUserInfo(result)?.isNewUser) {
        await handleNewUser(result.user);
      } else {
        await handleExistingUser(result.user);
      }
      status.value = 'signed-in';
    } else {
      throw new Error('Failed to sign-in');
    }
  }
  async function signOut() {
    try {
      await auth.signOut();
      user.value = null;
      profile.value = null;
      return true;
    } catch (error) {
      notify.push(Notifications.GENERIC({ error }));
    }
    return false;
  }
  function isVerificationLink(link: string) {
    return isSignInWithEmailLink(auth, link);
  }

  return {
    user,
    status,
    profile,
    stateCheck,
    registerAuthListener,
    deRegisterAuthListener,
    signIn,
    signOut,
    updateUserProfile,
    isVerificationLink,
    loadUserProfile
  };
});
