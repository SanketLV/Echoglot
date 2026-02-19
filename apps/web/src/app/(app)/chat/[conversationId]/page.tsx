'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMessages } from '@/hooks/use-messages';
import { useChatActions } from '@/hooks/use-chat-actions';
import { useChatStore } from '@/stores/chat-store';
import { useUserStore } from '@/stores/user-store';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const { sendMessage, startTyping, stopTyping, sendReadReceipt } = useChatActions();
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const setMessages = useChatStore((s) => s.setMessages);
  const storeMessages = useChatStore((s) => s.messages[conversationId]) ?? [];
  const markAsRead = useChatStore((s) => s.markAsRead);
  const conversations = useChatStore((s) => s.conversations);
  const user = useUserStore((s) => s.user);

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherMember = conversation?.members?.find((m: any) => m.user_id !== user?.id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(conversationId);

  useEffect(() => {
    setActiveConversation(conversationId);
    sendReadReceipt(conversationId);
    markAsRead(conversationId);
    return () => setActiveConversation(null);
  }, [conversationId, setActiveConversation, sendReadReceipt, markAsRead]);

  // Sync fetched messages to store, preserving any WS-added messages not yet in query cache
  useEffect(() => {
    if (data?.pages) {
      const fetched = data.pages.flatMap((p) => p.messages).reverse();
      const current = useChatStore.getState().messages[conversationId] ?? [];
      const fetchedIds = new Set(fetched.map((m) => m.id));
      // Keep WS-only messages (too new to be in the fetched pages) at the tail
      const wsOnlyTail = current.filter((m) => !fetchedIds.has(m.id));
      setMessages(conversationId, [...fetched, ...wsOnlyTail]);
    }
  }, [data, conversationId, setMessages]);

  const handleSend = (content: string) => {
    sendMessage(conversationId, content);
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader conversation={conversation} otherMember={otherMember} conversationId={conversationId} />
      <MessageList
        messages={storeMessages}
        currentUserId={user?.id ?? ''}
        conversationId={conversationId}
        onLoadMore={() => fetchNextPage()}
        hasMore={!!hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
      <MessageInput
        onSend={handleSend}
        onTypingStart={() => startTyping(conversationId)}
        onTypingStop={() => stopTyping(conversationId)}
      />
    </div>
  );
}
