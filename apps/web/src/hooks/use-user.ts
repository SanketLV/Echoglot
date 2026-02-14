'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { User, UserPreferences } from '@echoglot/shared-types';

import { api } from '@/lib/api';
import { useUserStore } from '@/stores/user-store';

export function useProfile() {
  const setUser = useUserStore((s) => s.setUser);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get<User>('/v1/users/me');
      return response.data!;
    },
    select: (data) => {
      setUser(data);
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.patch<User>('/v1/users/me', data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function usePreferences() {
  const setPreferences = useUserStore((s) => s.setPreferences);

  return useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const response = await api.get<UserPreferences>(
        '/v1/users/me/preferences',
      );
      return response.data!;
    },
    select: (data) => {
      setPreferences(data);
      return data;
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserPreferences>) => {
      const response = await api.patch<UserPreferences>(
        '/v1/users/me/preferences',
        data,
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
