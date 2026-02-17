'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import type { MessageWithTranslation } from '@echoglot/shared-types';

import { api } from '@/lib/api';

interface MessagesResponse {
  messages: MessageWithTranslation[];
  nextCursor: string | null;
}

export function useMessages(conversationId: string | null) {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam);
      params.set('limit', '50');

      const response = await api.get<MessageWithTranslation[]>(
        `/v1/conversations/${conversationId}/messages?${params.toString()}`,
      );
      // The API returns { success, data, nextCursor }
      const raw = response as any;
      return {
        messages: raw.data ?? [],
        nextCursor: raw.nextCursor ?? null,
      } as MessagesResponse;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!conversationId,
  });
}

export function useOriginalMessage(
  conversationId: string,
  messageId: string,
  enabled = false,
) {
  return useQuery({
    queryKey: ['original-message', conversationId, messageId],
    queryFn: async () => {
      const response = await api.get<{ content: string }>(
        `/v1/conversations/${conversationId}/messages/${messageId}/original`,
      );
      return response.data!;
    },
    enabled,
  });
}
