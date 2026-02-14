import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  preferredLang: z.string().min(2).max(5).optional(),
  nativeLang: z.string().min(2).max(5).optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']).optional(),
  notificationsEnabled: z.boolean().optional(),
  autoTranslate: z.boolean().optional(),
  defaultInputLang: z.string().min(2).max(5).optional(),
  defaultOutputLang: z.string().min(2).max(5).optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesFormValues = z.infer<typeof updatePreferencesSchema>;
