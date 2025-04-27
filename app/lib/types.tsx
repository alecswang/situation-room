export type UserRole = 'activist' | 'journalist';

export interface Room {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  leaders: string[];
  memberCount: number;
}

export interface Message {
  id: string;
  text: string;
  uid: string;
  photoURL?: string;
  displayName?: string;
  createdAt: Date;
  isLeader?: boolean;
  isJournalist?: boolean;
}

export interface UserData {
  role: UserRole;
  displayName: string;
  email: string;
}