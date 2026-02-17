'use client';

import { useEffect, useRef } from 'react';
import type { MessageWithTranslation } from '@echoglot/shared-types';
import { MessageBubble } from './message-bubble';
import { Button } from '@echoglot/ui';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: MessageWithTranslation[];
  currentUserId: string;
  conversationId: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  conversationId,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-text-tertiary"
          >
            {isLoadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isLoadingMore ? 'Loading...' : 'Load earlier messages'}
          </Button>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isSent={msg.senderId === currentUserId || (msg as any).sender_id === currentUserId}
          conversationId={conversationId}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
