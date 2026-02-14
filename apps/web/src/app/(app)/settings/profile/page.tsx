'use client';

import { useState, useEffect } from 'react';

import { LanguageSelector } from '@/components/shared/language-selector';
import { useProfile, useUpdateProfile } from '@/hooks/use-user';

export default function ProfileSettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState('');
  const [preferredLang, setPreferredLang] = useState('en');
  const [nativeLang, setNativeLang] = useState('en');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPreferredLang(profile.preferredLang || 'en');
      setNativeLang(profile.nativeLang || 'en');
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);

    updateProfile.mutate(
      { displayName, preferredLang, nativeLang },
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
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-body-sm font-medium text-text-secondary">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-border-default bg-muted px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-body-sm font-medium text-text-secondary">Native Language</label>
          <LanguageSelector value={nativeLang} onValueChange={setNativeLang} />
        </div>

        <div className="space-y-2">
          <label className="text-body-sm font-medium text-text-secondary">
            Preferred Translation Language
          </label>
          <LanguageSelector value={preferredLang} onValueChange={setPreferredLang} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="h-10 rounded-lg bg-gradient-cta px-6 text-body-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Saving...' : 'Save changes'}
        </button>
        {saved && <span className="text-body-sm text-success-500">Changes saved</span>}
      </div>
    </form>
  );
}
