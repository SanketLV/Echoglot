'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Users, Settings, PanelLeftClose, PanelLeft } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage, Button } from '@echoglot/ui';
import { cn } from '@echoglot/ui/lib/utils';

import { useUserStore } from '@/stores/user-store';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border-default bg-surface transition-[width] duration-200',
        collapsed ? 'w-[72px]' : 'w-[280px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border-default px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-cyan-400">
          <span className="text-sm font-bold text-white">E</span>
        </div>
        {!collapsed && (
          <span className="text-heading-xs font-bold tracking-tight text-text-primary">
            Echoglot
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-500/15 text-accent-400'
                  : 'text-text-secondary hover:bg-subtle hover:text-text-primary',
                collapsed && 'justify-center px-0',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User + collapse toggle */}
      <div className="border-t border-border-default p-3">
        <div
          className={cn(
            'flex items-center gap-3',
            collapsed && 'flex-col',
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.displayName ?? 'User'} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium text-text-primary">
                {user?.displayName ?? 'User'}
              </p>
              <p className="truncate text-body-xs text-text-tertiary">
                {user?.email ?? ''}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((c) => !c)}
            className="h-8 w-8 shrink-0 text-text-tertiary hover:text-text-primary"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
