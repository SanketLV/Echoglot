'use client';

import { useEffect } from 'react';

import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { useProfile, usePreferences } from '@/hooks/use-user';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfile();
  const { data: preferences } = usePreferences();

  // Silence unused variable warnings - data is fetched to populate the store
  useEffect(() => {
    // Profile and preferences are automatically synced to the store via query hooks
  }, [profile, preferences]);

  return (
    <div className="flex h-screen bg-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
