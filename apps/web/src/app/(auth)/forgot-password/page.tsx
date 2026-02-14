'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AuthFormWrapper } from '@/components/auth/auth-form-wrapper';
import { useAuth } from '@/hooks/use-auth';
import { type ForgotPasswordFormValues, forgotPasswordSchema } from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordFormValues>({ email: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Invalid input');
      setLoading(false);
      return;
    }

    const { error: resetError } = await resetPassword(result.data.email);
    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <AuthFormWrapper
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
      footer={
        <p className="text-body-sm text-text-tertiary">
          Remember your password?{' '}
          <Link href="/login" className="text-accent-500 hover:text-accent-400 transition-colors">
            Sign in
          </Link>
        </p>
      }
    >
      {success ? (
        <div className="rounded-lg bg-success-500/10 border border-success-500/20 px-4 py-3 text-body-sm text-success-500">
          Check your email for a password reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-body-sm text-error">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-body-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-border-default bg-muted px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-gradient-cta text-body-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthFormWrapper>
  );
}
