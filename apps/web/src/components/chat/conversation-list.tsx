'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Input } from '@echoglot/ui';
import { cn } from '@echoglot/ui/lib/utils';
import { useConversations } from '@/hooks/use-conversations';
import { useChatStore } from '@/stores/chat-store';
import { useUserStore } from '@/stores/user-store';
import { NewChatDialog } from './new-chat-dialog';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayMs = 86400000;

  if (diff < dayMs) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 7 * dayMs) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function ConversationList() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const pathname = usePathname();
  const { data: conversations } = useConversations();
  const unreadCounts = useChatStore((s) => s.unreadCounts);
  const user = useUserStore((s) => s.user);

  const filteredConversations = (conversations ?? []).filter((conv) => {
    if (!search) return true;
    const otherMember = conv.members?.find((m: any) => m.user_id !== user?.id);
    const name = (otherMember as any)?.user?.display_name ?? '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <h2 className="text-heading-xs font-semibold text-text-primary">Chats</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDialogOpen(true)}>
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-subtle border-border-default"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => {
          const otherMember = conv.members?.find((m: any) => m.user_id !== user?.id);
          const memberUser = (otherMember as any)?.user;
          const name = memberUser?.display_name ?? 'Unknown';
          const avatar = memberUser?.avatar_url;
          const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          const isActive = pathname === `/chat/${conv.id}`;
          const unread = unreadCounts[conv.id] ?? conv.unreadCount ?? 0;
          const lastMsg = conv.lastMessage;

          return (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors',
                isActive ? 'bg-accent-500/10' : 'hover:bg-subtle',
              )}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-body-sm font-medium text-text-primary">{name}</span>
                  {lastMsg && (
                    <span className="text-body-xs text-text-tertiary shrink-0 ml-2">
                      {formatTime(lastMsg.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-body-xs text-text-tertiary">
                    {lastMsg?.content ?? 'No messages yet'}
                  </p>
                  {unread > 0 && (
                    <Badge variant="default" className="ml-2 h-5 min-w-[20px] shrink-0 bg-accent-500 text-white text-[10px] px-1.5">
                      {unread}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="p-8 text-center text-body-sm text-text-tertiary">
            No conversations yet
          </div>
        )}
      </div>

      <NewChatDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
