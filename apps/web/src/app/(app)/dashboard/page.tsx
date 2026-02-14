'use client';

import { Languages, Mic, MessageSquare } from 'lucide-react';

import { useUserStore } from '@/stores/user-store';

export default function DashboardPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-app-title text-text-primary">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Your real-time translation dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
            <MessageSquare className="h-5 w-5 text-accent-500" />
          </div>
          <h3 className="text-app-heading text-text-primary">Chat Translation</h3>
          <p className="text-app-caption text-text-tertiary">
            Coming in Phase 2 — real-time text translation across languages.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-live-500/10">
            <Mic className="h-5 w-5 text-live-500" />
          </div>
          <h3 className="text-app-heading text-text-primary">Voice Calls</h3>
          <p className="text-app-caption text-text-tertiary">
            Coming in Phase 3 — speak naturally and be understood in any language.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pop-500/10">
            <Languages className="h-5 w-5 text-pop-500" />
          </div>
          <h3 className="text-app-heading text-text-primary">Voice Cloning</h3>
          <p className="text-app-caption text-text-tertiary">
            Coming in Phase 5 — preserve your voice identity across languages.
          </p>
        </div>
      </div>

      <div className="glass-elevated p-8 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-glow">
          <Languages className="h-8 w-8 text-accent-500" />
        </div>
        <h2 className="text-heading-md text-text-primary">Ready for Phase 2</h2>
        <p className="text-body-md text-text-secondary max-w-md mx-auto">
          Your account is set up and ready to go. Chat translation features will be available soon.
          In the meantime, head to Settings to configure your profile and language preferences.
        </p>
      </div>
    </div>
  );
}
