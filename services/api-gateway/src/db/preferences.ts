import { supabaseAdmin } from '../config/supabase.js';

export async function getPreferences(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertPreferences(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .upsert(
      { user_id: userId, ...updates },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
