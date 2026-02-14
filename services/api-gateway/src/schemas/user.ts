import { z } from 'zod';

export const updateProfileBody = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  preferredLang: z.string().min(2).max(10).optional(),
  nativeLang: z.string().min(2).max(10).optional(),
});

export const updatePreferencesBody = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notificationsEnabled: z.boolean().optional(),
  autoTranslate: z.boolean().optional(),
  defaultInputLang: z.string().min(2).max(10).optional(),
  defaultOutputLang: z.string().min(2).max(10).optional(),
});

export type UpdateProfileBody = z.infer<typeof updateProfileBody>;
export type UpdatePreferencesBody = z.infer<typeof updatePreferencesBody>;
