'use client';

import { useChatWs } from '@/hooks/use-chat-ws';
import { ConversationList } from '@/components/chat/conversation-list';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useChatWs();

  return (
    <div className="flex h-full">
      {/* Conversation sidebar */}
      <div className="w-[320px] shrink-0 border-r border-border-default">
        <ConversationList />
      </div>
      {/* Message area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
