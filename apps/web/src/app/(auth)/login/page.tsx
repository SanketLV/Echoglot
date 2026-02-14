'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthFormWrapper } from '@/components/auth/auth-form-wrapper';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { useAuth } from '@/hooks/use-auth';
import { type LoginFormValues, loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Invalid input');
      setLoading(false);
      return;
    }

    const { error: authError } = await signIn(result.data.email, result.data.password);
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <AuthFormWrapper
      title="Welcome back"
      description="Sign in to your Echoglot account"
      footer={
        <p className="text-body-sm text-text-tertiary">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent-500 hover:text-accent-400 transition-colors">
            Sign up
          </Link>
        </p>
      }
    >
      <OAuthButtons />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default" />
        </div>
        <div className="relative flex justify-center text-body-xs">
          <span className="bg-elevated px-2 text-text-tertiary">or continue with email</span>
        </div>
      </div>

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
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="flex h-10 w-full rounded-lg border border-border-default bg-muted px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-body-sm font-medium text-text-secondary">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-body-xs text-text-tertiary hover:text-accent-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            className="flex h-10 w-full rounded-lg border border-border-default bg-muted px-3 py-2 text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-gradient-cta text-body-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthFormWrapper>
  );
}
