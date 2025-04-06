import type { ContestCycle } from "./contestCycle";

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// Backend of a notification
export type Notification = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  initialDate: string;
  finalDate: string;
  priority: NotificationPriority;
  redirectionURL: string;
  pinned: boolean;
  contestCycle: ContestCycle;
};

// Frontend view of a notification
export type NotificationView = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  initialDate: string;
  finalDate: string;
  pinned: boolean;
  redirectionURL: string;
  priority: NotificationPriority;
  contestCycle: string;
};
