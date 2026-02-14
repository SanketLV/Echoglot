'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  async function handleDeleteAccount() {
    if (confirmText !== 'DELETE') return;
    setLoading(true);

    try {
      await api.delete('/v1/users/me');
      await signOut();
      router.push('/login');
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-app-heading text-text-primary">Account</h2>
        <p className="text-body-md text-text-secondary">Manage your account settings.</p>
      </div>

      <div className="rounded-xl border border-error/20 bg-error/5 p-6 space-y-4">
        <h3 className="text-app-heading text-error">Danger Zone</h3>
        <p className="text-body-sm text-text-secondary">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="h-10 rounded-lg bg-error px-6 text-body-sm font-medium text-white hover:bg-error/90 transition-colors"
          >
            Delete account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-body-sm text-text-secondary">
              Type <span className="font-mono font-bold text-error">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="flex h-10 w-full max-w-xs rounded-lg border border-error/30 bg-muted px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE' || loading}
                className="h-10 rounded-lg bg-error px-6 text-body-sm font-medium text-white hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Permanently delete account'}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText('');
                }}
                className="h-10 rounded-lg bg-muted px-6 text-body-sm font-medium text-text-secondary hover:bg-subtle transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
