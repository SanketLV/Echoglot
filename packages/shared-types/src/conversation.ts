import { Message } from './message';

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  lastReadAt: string;
}

export interface ConversationWithMembers extends Conversation {
  members: ConversationMember[];
}

export interface ConversationPreview extends Conversation {
  members: ConversationMember[];
  lastMessage?: Message;
  unreadCount: number;
}
