import { supabaseAdmin } from '../config/supabase.js';

function mapPrefsRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    userId: row.user_id,
    theme: row.theme,
    notificationsEnabled: row.notifications_enabled,
    autoTranslate: row.auto_translate,
    defaultInputLang: row.default_input_lang,
    defaultOutputLang: row.default_output_lang,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPreferences(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapPrefsRow(data) : null;
}

export async function upsertPreferences(userId: string, updates: Record<string, unknown>) {
  // Map camelCase input keys to snake_case DB column names
  const mapped: Record<string, unknown> = { user_id: userId };
  if ('theme' in updates) mapped.theme = updates.theme;
  if ('notificationsEnabled' in updates) mapped.notifications_enabled = updates.notificationsEnabled;
  if ('autoTranslate' in updates) mapped.auto_translate = updates.autoTranslate;
  if ('defaultInputLang' in updates) mapped.default_input_lang = updates.defaultInputLang;
  if ('defaultOutputLang' in updates) mapped.default_output_lang = updates.defaultOutputLang;

  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .upsert(mapped, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return mapPrefsRow(data);
}
