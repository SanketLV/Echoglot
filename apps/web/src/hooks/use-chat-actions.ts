'use client';

import { useCallback } from 'react';

import { wsClient } from '@/lib/ws';

/**
 * Thin hook for sending WS events from within a conversation.
 * Does NOT manage WS lifecycle — that lives in useChatWs (ChatLayout).
 */
export function useChatActions() {
  const sendMessage = useCallback((conversationId: string, content: string) => {
    wsClient.send({ type: 'message.send', conversationId, content });
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    wsClient.send({ type: 'typing.start', conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    wsClient.send({ type: 'typing.stop', conversationId });
  }, []);

  const sendReadReceipt = useCallback((conversationId: string) => {
    wsClient.send({ type: 'read.receipt', conversationId });
  }, []);

  return { sendMessage, startTyping, stopTyping, sendReadReceipt };
}
