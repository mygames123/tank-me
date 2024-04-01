import type { Nullable } from '@babylonjs/core';
import type {
  MatchStats,
  NotificationAction,
  NotificationStatus,
  NotificationType,
  PlayerInputs
} from './types';

export interface IMessageInput {
  step: number;
  // Actual timestamp is set at server, TS = ServerTime - AveragePing
  timestamp?: 0;
  input: PlayerInputs;
}

export interface IMessageFire {
  id: string;
}
export interface IMessageEnd {
  winner: Nullable<string>;
  loser: Nullable<string>;
  isDraw: boolean;
  stats: MatchStats;
}

export interface ITrapBounds {
  first: Node | null;
  last: Node | null;
}

export interface IModalAction {
  text: string;
  action?: () => Promise<void> | void;
  async?: boolean;
  busy?: boolean;
}
export interface IModalInfo {
  title: string;
  controls: IModalAction[];
  message: string;
}

export interface INotification {
  type: NotificationType;
  title: string;
  status: NotificationStatus;
  message: string;
  action?: NotificationAction;
  error?: unknown;
}
