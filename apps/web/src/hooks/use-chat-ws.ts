'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  ChatMessageReceive,
  TypingEvent,
} from '@echoglot/shared-types';

import { createClient } from '@/lib/supabase/client';
import { wsClient } from '@/lib/ws';
import { useChatStore } from '@/stores/chat-store';

export function useChatWs() {
  const [isConnected, setIsConnected] = useState(false);
  const typingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const addMessage = useChatStore((s) => s.addMessage);
  const addTypingUser = useChatStore((s) => s.addTypingUser);
  const removeTypingUser = useChatStore((s) => s.removeTypingUser);
  const incrementUnread = useChatStore((s) => s.incrementUnread);
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  useEffect(() => {
    let mounted = true;

    async function connect() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token || !mounted) return;
      wsClient.connect(session.access_token);
    }

    connect();

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);

    const onMessageReceive = (data: ChatMessageReceive) => {
      addMessage(data.conversationId, data.message);
      if (data.conversationId !== activeConversationId) {
        incrementUnread(data.conversationId);
      }
    };

    const onTypingStart = (data: TypingEvent) => {
      addTypingUser(data.conversationId, data.userId);
      const key = `${data.conversationId}:${data.userId}`;
      const existing = typingTimers.current.get(key);
      if (existing) clearTimeout(existing);
      typingTimers.current.set(
        key,
        setTimeout(
          () => removeTypingUser(data.conversationId, data.userId),
          3000,
        ),
      );
    };

    const onTypingStop = (data: TypingEvent) => {
      removeTypingUser(data.conversationId, data.userId);
      const key = `${data.conversationId}:${data.userId}`;
      const existing = typingTimers.current.get(key);
      if (existing) {
        clearTimeout(existing);
        typingTimers.current.delete(key);
      }
    };

    wsClient.on('connected', onConnected);
    wsClient.on('disconnected', onDisconnected);
    wsClient.on('message.receive', onMessageReceive);
    wsClient.on('typing.start', onTypingStart);
    wsClient.on('typing.stop', onTypingStop);

    return () => {
      mounted = false;
      wsClient.off('connected', onConnected);
      wsClient.off('disconnected', onDisconnected);
      wsClient.off('message.receive', onMessageReceive);
      wsClient.off('typing.start', onTypingStart);
      wsClient.off('typing.stop', onTypingStop);
      wsClient.disconnect();
      typingTimers.current.forEach((timer) => clearTimeout(timer));
      typingTimers.current.clear();
    };
  }, [
    addMessage,
    addTypingUser,
    removeTypingUser,
    incrementUnread,
    activeConversationId,
  ]);

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      wsClient.send({ type: 'message.send', conversationId, content });
    },
    [],
  );

  const startTyping = useCallback((conversationId: string) => {
    wsClient.send({ type: 'typing.start', conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    wsClient.send({ type: 'typing.stop', conversationId });
  }, []);

  const sendReadReceipt = useCallback((conversationId: string) => {
    wsClient.send({ type: 'read.receipt', conversationId });
  }, []);

  return { sendMessage, startTyping, stopTyping, sendReadReceipt, isConnected };
}
