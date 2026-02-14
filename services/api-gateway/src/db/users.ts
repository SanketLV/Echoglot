import { supabaseAdmin } from '../config/supabase.js';

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(id: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw error;
}
