'use client';

import { Avatar, AvatarFallback, AvatarImage, Badge } from '@echoglot/ui';
import { useChatStore } from '@/stores/chat-store';
import { TypingIndicator } from './typing-indicator';

interface ChatHeaderProps {
  conversation: any;
  otherMember: any;
  conversationId: string;
}

export function ChatHeader({ otherMember, conversationId }: ChatHeaderProps) {
  const typingUsers = useChatStore((s) => s.typingUsers[conversationId] ?? []);
  const memberUser = otherMember?.user;
  const name = memberUser?.display_name ?? 'Unknown';
  const avatar = memberUser?.avatar_url;
  const lang = memberUser?.preferred_lang ?? memberUser?.native_lang;
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex items-center gap-3 border-b border-border-default px-4 py-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-body-sm font-semibold text-text-primary">{name}</h3>
          {lang && (
            <Badge variant="outline" className="text-[10px] border-border-default text-text-tertiary">
              {lang.toUpperCase()}
            </Badge>
          )}
        </div>
        {typingUsers.length > 0 && <TypingIndicator />}
      </div>
    </div>
  );
}
