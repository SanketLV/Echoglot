import { z } from 'zod';

export const registerBody = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  displayName: z.string().min(1, 'Display name is required.').max(100),
});

export const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshBody = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterBody = z.infer<typeof registerBody>;
export type LoginBody = z.infer<typeof loginBody>;
export type RefreshBody = z.infer<typeof refreshBody>;
