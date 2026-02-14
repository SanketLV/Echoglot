'use client';

import { create } from 'zustand';

import type { User, UserPreferences } from '@echoglot/shared-types';

interface UserState {
  user: User | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setPreferences: (preferences: UserPreferences | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  preferences: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, preferences: null, isLoading: false }),
}));
