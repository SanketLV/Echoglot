'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  ConversationPreview,
  ConversationWithMembers,
} from '@echoglot/shared-types';

import { api } from '@/lib/api';
import { useChatStore } from '@/stores/chat-store';

export function useConversations() {
  const setConversations = useChatStore((s) => s.setConversations);

  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response =
        await api.get<ConversationPreview[]>('/v1/conversations');
      const data = response.data!;
      setConversations(data);
      return data;
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactId: string) => {
      const response = await api.post<ConversationWithMembers>(
        '/v1/conversations',
        { contactId },
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
