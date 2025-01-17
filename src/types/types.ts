import { type Sound } from '@babylonjs/core';

export type AuthStatus = 'pending' | 'blocked' | 'verified' | 'signed-in' | 'signed-out';
export type AuthType = 'email' | 'verify' | 'guest' | 'guest-verify';

export type LobbyStatus = 'connecting' | 'failed' | 'idle' | 'matchmaking' | 'playing';

export enum GameInputType {
  FORWARD = 0,
  REVERSE = 1,
  LEFT = 2,
  RIGHT = 3,
  BRAKE = 4,
  BARREL_UP = 5,
  BARREL_DOWN = 6,
  TURRET_LEFT = 7,
  TURRET_RIGHT = 8,
  FIRE = 9,
  RESET = 10,
  CHANGE_PERSPECTIVE = 11
}
export enum KeyInputType {
  KEY_W = 'KeyW',
  KEY_S = 'KeyS',
  KEY_A = 'KeyA',
  KEY_D = 'KeyD',
  KEY_SPACE = 'Space',
  KEY_ARROW_UP = 'ArrowUp',
  KEY_ARROW_DOWN = 'ArrowDown',
  KEY_ARROW_LEFT = 'ArrowLeft',
  KEY_ARROW_RIGHT = 'ArrowRight',
  KEY_CTRL_LEFT = 'ControlLeft',
  KEY_CTRL_RIGHT = 'ControlRight',
  KEY_R = 'KeyR',
  KEY_V = 'KeyV'
}
export enum TouchInputType {
  JOYSTICK_PRIMARY_UP = 'Joystick1Up',
  JOYSTICK_PRIMARY_DOWN = 'Joystick1Down',
  JOYSTICK_PRIMARY_LEFT = 'Joystick1Left',
  JOYSTICK_PRIMARY_RIGHT = 'Joystick1Right',
  BRAKE = 'Brake',
  JOYSTICK_SECONDARY_UP = 'Joystick2Up',
  JOYSTICK_SECONDARY_DOWN = 'Joystick2Down',
  JOYSTICK_SECONDARY_LEFT = 'Joystick2Left',
  JOYSTICK_SECONDARY_RIGHT = 'Joystick2Right',
  FIRE = 'Fire',
  RESET = 'Reset',
  PERSPECTIVE = 'Perspective'
}

export enum MessageType {
  INPUT = 'input',
  LOAD = 'load',
  ENEMY_FIRE = 'enemy-fire',
  MATCH_END = 'match-end'
}

export type TankSoundType = 'idle' | 'move' | 'explode' | 'turret' | 'cannon' | 'load' | 'whizz1' | 'whizz2';
export type TankSounds = {
  [id in TankSoundType]?: Sound;
};

export type PlayerInputs = Partial<Record<GameInputType, boolean>>;

export type NotificationType = 'popup';
export type NotificationStatus = 'info' | 'warn' | 'error' | 'success';
export type NotificationAction = 'reload';

export type ErrorInfo = { error: unknown; isCritical?: boolean };

export enum SpawnAxis {
  PX = 0,
  NX = 1,
  PZ = 2,
  NZ = 3
}

export type EnemyAIState = { move: 'roam' | 'track' | null; combat: 'basic' | null };

export type PlayerStats = {
  shellsUsed: number;
  totalDamage: number;
  points?: number;
};
export type MatchStats = Record<string, PlayerStats>;

export type ScreenOrientation = 'landscape' | 'portrait';

export type ObjectStoreName = 'files' | 'users' | 'preferences';

export type GraphicsPresetType = 'high' | 'low';

export type ShadowGeneratorQuality = 0 | 1 | 2;
