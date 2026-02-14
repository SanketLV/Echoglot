import { supabaseAdmin } from '../config/supabase.js';

export async function getContacts(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .select('*, contact:users!contact_user_id(id, display_name, email, avatar_url)')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function getContactById(id: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .select('*, contact:users!contact_user_id(id, display_name, email, avatar_url)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createContact(userId: string, contactEmail: string) {
  // Look up the contact user by email
  const { data: contactUser, error: lookupError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', contactEmail)
    .single();

  if (lookupError || !contactUser) {
    throw Object.assign(new Error('User not found with that email.'), { statusCode: 404 });
  }

  if (contactUser.id === userId) {
    throw Object.assign(new Error('Cannot add yourself as a contact.'), { statusCode: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('contacts')
    .insert({
      user_id: userId,
      contact_user_id: contactUser.id,
    })
    .select('*, contact:users!contact_user_id(id, display_name, email, avatar_url)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateContact(
  id: string,
  userId: string,
  updates: Record<string, unknown>,
) {
  const { data, error } = await supabaseAdmin
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContact(id: string, userId: string) {
  const { error } = await supabaseAdmin
    .from('contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
