'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { LanguageSelector } from '@/components/shared/language-selector';
import { useUpdateProfile } from '@/hooks/use-user';

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const [nativeLang, setNativeLang] = useState('en');
  const [preferredLang, setPreferredLang] = useState('en');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    updateProfile.mutate(
      { nativeLang, preferredLang, onboardingComplete: true },
      {
        onSuccess: () => router.push('/dashboard'),
        onError: () => setError('Something went wrong. Please try again.'),
      },
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border-default bg-elevated p-8 shadow-2xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-text-primary">One last step</h1>
        <p className="text-body-md text-text-secondary">
          Tell us your languages so we can translate conversations for you in real time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-body-sm text-error">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-body-sm font-medium text-text-secondary">
            I speak — <span className="text-text-tertiary">(your native language)</span>
          </label>
          <LanguageSelector value={nativeLang} onValueChange={setNativeLang} />
        </div>

        <div className="space-y-2">
          <label className="text-body-sm font-medium text-text-secondary">
            Translate incoming messages to — <span className="text-text-tertiary">(what you want to read)</span>
          </label>
          <LanguageSelector value={preferredLang} onValueChange={setPreferredLang} />
        </div>

        <p className="text-app-caption text-text-tertiary">
          You can change these any time in Settings → Profile.
        </p>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="w-full h-10 rounded-lg bg-gradient-cta text-body-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateProfile.isPending ? 'Saving...' : 'Start translating'}
        </button>
      </form>
    </div>
  );
}
