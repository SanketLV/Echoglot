'use client';

import { useState, useEffect } from 'react';

import { usePreferences, useUpdatePreferences } from '@/hooks/use-user';

export default function PreferencesSettingsPage() {
  const { data: preferences, isLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (preferences) {
      setTheme((preferences.theme as 'dark' | 'light' | 'system') || 'dark');
      setNotificationsEnabled(preferences.notificationsEnabled ?? true);
      setAutoTranslate(preferences.autoTranslate ?? true);
    }
  }, [preferences]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);

    updatePreferences.mutate(
      { theme, notificationsEnabled, autoTranslate },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-body-sm font-medium text-text-secondary">Theme</label>
          <div className="flex gap-2">
            {(['dark', 'light', 'system'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`h-10 px-4 rounded-lg text-body-sm font-medium transition-colors ${
                  theme === t
                    ? 'bg-accent-500 text-white'
                    : 'bg-muted text-text-secondary hover:bg-subtle'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-sm font-medium text-text-primary">Notifications</p>
            <p className="text-app-caption text-text-tertiary">Receive push notifications</p>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              notificationsEnabled ? 'bg-accent-500' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-sm font-medium text-text-primary">Auto-translate</p>
            <p className="text-app-caption text-text-tertiary">
              Automatically translate incoming messages
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              autoTranslate ? 'bg-accent-500' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                autoTranslate ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={updatePreferences.isPending}
          className="h-10 rounded-lg bg-gradient-cta px-6 text-body-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {updatePreferences.isPending ? 'Saving...' : 'Save preferences'}
        </button>
        {saved && <span className="text-body-sm text-success-500">Preferences saved</span>}
      </div>
    </form>
  );
}
