'use client';

import { Bell } from 'lucide-react';

import { Button } from '@echoglot/ui';

import { UserNav } from '@/components/layout/user-nav';

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-default px-6">
      {/* Left: page title */}
      <h1 className="text-heading-sm font-semibold text-text-primary">
        {title ?? ''}
      </h1>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-text-tertiary hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
