import { supabaseAdmin } from '../config/supabase.js';

function mapUserRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    preferredLang: row.preferred_lang,
    nativeLang: row.native_lang,
    subscriptionTier: row.subscription_tier,
    voiceProfileId: row.voice_profile_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return mapUserRow(data);
}

export async function updateUser(id: string, updates: Record<string, unknown>) {
  // Map camelCase input keys to snake_case DB column names
  const mapped: Record<string, unknown> = {};
  if ('displayName' in updates) mapped.display_name = updates.displayName;
  if ('avatarUrl' in updates) mapped.avatar_url = updates.avatarUrl;
  if ('preferredLang' in updates) mapped.preferred_lang = updates.preferredLang;
  if ('nativeLang' in updates) mapped.native_lang = updates.nativeLang;

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(mapped)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapUserRow(data);
}

export async function deleteUser(id: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw error;
}
