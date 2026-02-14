import { z } from 'zod';

export const createContactBody = z.object({
  contactEmail: z.string().email(),
});

export const updateContactBody = z.object({
  nickname: z.string().min(1).max(100).optional(),
  status: z.enum(['active', 'blocked', 'muted']).optional(),
});

export const contactIdParam = z.object({
  id: z.string().uuid(),
});

export type CreateContactBody = z.infer<typeof createContactBody>;
export type UpdateContactBody = z.infer<typeof updateContactBody>;
export type ContactIdParam = z.infer<typeof contactIdParam>;
