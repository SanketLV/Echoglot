import { z } from 'zod';

export const createConversationBody = z.object({
  contactId: z.string().uuid(),
});

export const conversationIdParam = z.object({
  id: z.string().uuid(),
});

export const messagesQuery = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const messageIdParam = z.object({
  mid: z.string().uuid(),
});

export type CreateConversationBody = z.infer<typeof createConversationBody>;
export type ConversationIdParam = z.infer<typeof conversationIdParam>;
export type MessagesQuery = z.infer<typeof messagesQuery>;
export type MessageIdParam = z.infer<typeof messageIdParam>;
