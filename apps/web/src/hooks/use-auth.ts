'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/stores/user-store';

export function useAuth() {
  const router = useRouter();
  const reset = useUserStore((s) => s.reset);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      return { data, error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      reset();
      router.push('/login');
    }
    return { error };
  }, [reset, router]);

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
    return { data, error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  }, []);

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
  };
}
