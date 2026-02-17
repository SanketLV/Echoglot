'use client';

import { create } from 'zustand';

import type {
  ConversationPreview,
  MessageWithTranslation,
} from '@echoglot/shared-types';

interface ChatState {
  conversations: ConversationPreview[];
  activeConversationId: string | null;
  messages: Record<string, MessageWithTranslation[]>;
  typingUsers: Record<string, string[]>;
  unreadCounts: Record<string, number>;
  setConversations: (conversations: ConversationPreview[]) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (
    conversationId: string,
    message: MessageWithTranslation,
  ) => void;
  setMessages: (
    conversationId: string,
    messages: MessageWithTranslation[],
  ) => void;
  prependMessages: (
    conversationId: string,
    messages: MessageWithTranslation[],
  ) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  updateUnreadCount: (conversationId: string, count: number) => void;
  incrementUnread: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  unreadCounts: {},

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] ?? []),
          message,
        ],
      },
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  prependMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...messages,
          ...(state.messages[conversationId] ?? []),
        ],
      },
    })),

  addTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] ?? [];
      if (current.includes(userId)) return state;
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...current, userId],
        },
      };
    }),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] ?? []).filter(
          (id) => id !== userId,
        ),
      },
    })),

  updateUnreadCount: (conversationId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: count },
    })),

  incrementUnread: (conversationId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] ?? 0) + 1,
      },
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: 0 },
    })),

  reset: () =>
    set({
      conversations: [],
      activeConversationId: null,
      messages: {},
      typingUsers: {},
      unreadCounts: {},
    }),
}));
