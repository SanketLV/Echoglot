import { supabaseAdmin } from '../config/supabase.js';

export async function getMessages(
  conversationId: string,
  userId: string,
  cursor?: string,
  limit = 50,
) {
  // Verify membership
  const { data: membership, error: memError } = await supabaseAdmin
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (memError || !membership) {
    throw Object.assign(new Error('Conversation not found.'), { statusCode: 404 });
  }

  // Get user's preferred language for translations
  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('preferred_lang')
    .eq('id', userId)
    .single();

  const preferredLang = userRow?.preferred_lang ?? 'en';

  let query = supabaseAdmin
    .from('messages')
    .select(`
      *,
      translation:message_translations(*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    // Get the cursor message's created_at
    const { data: cursorMsg } = await supabaseAdmin
      .from('messages')
      .select('created_at')
      .eq('id', cursor)
      .single();

    if (cursorMsg) {
      query = query.lt('created_at', cursorMsg.created_at);
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  // Filter translations to only the user's preferred language
  const messages = (data ?? []).map((msg) => {
    const translations = msg.translation ?? [];
    const userTranslation = translations.find((t: any) => t.target_lang === preferredLang);
    return {
      ...msg,
      translation: userTranslation ?? null,
    };
  });

  return {
    messages,
    nextCursor: messages.length === limit ? messages[messages.length - 1]?.id : null,
  };
}

export async function createMessage(conversationId: string, senderId: string, content: string) {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  if (error) throw error;

  // Update conversation updated_at
  await supabaseAdmin
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

export async function createTranslation(
  messageId: string,
  targetLang: string,
  translatedContent: string,
  engine: string,
) {
  const { data, error } = await supabaseAdmin
    .from('message_translations')
    .insert({
      message_id: messageId,
      target_lang: targetLang,
      translated_content: translatedContent,
      engine,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOriginalText(messageId: string, userId: string) {
  // First get the message to find its conversation
  const { data: msg, error: msgError } = await supabaseAdmin
    .from('messages')
    .select('id, conversation_id, content')
    .eq('id', messageId)
    .single();

  if (msgError || !msg) {
    throw Object.assign(new Error('Message not found.'), { statusCode: 404 });
  }

  // Verify user is a member of the conversation
  const { data: membership, error: memError } = await supabaseAdmin
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', msg.conversation_id)
    .eq('user_id', userId)
    .single();

  if (memError || !membership) {
    throw Object.assign(new Error('Not a member of this conversation.'), { statusCode: 403 });
  }

  return { content: msg.content };
}
