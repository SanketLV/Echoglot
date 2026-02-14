'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Contact, ContactWithUser } from '@echoglot/shared-types';

import { api } from '@/lib/api';

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await api.get<ContactWithUser[]>('/v1/contacts');
      return response.data!;
    },
  });
}

export function useAddContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactEmail: string) => {
      const response = await api.post<Contact>('/v1/contacts', {
        contactEmail,
      });
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Contact>;
    }) => {
      const response = await api.patch<Contact>(`/v1/contacts/${id}`, data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
