import { supabaseAdmin } from '../config/supabase.js';

export async function listConversations(userId: string) {
  // Get conversations where user is a member
  const { data: memberships, error: memError } = await supabaseAdmin
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId);

  if (memError) throw memError;
  if (!memberships || memberships.length === 0) return [];

  const conversationIds = memberships.map((m) => m.conversation_id);

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select(`
      *,
      members:conversation_members(*, user:users(id, display_name, avatar_url, preferred_lang, native_lang)),
      messages:messages(id, content, sender_id, created_at)
    `)
    .in('id', conversationIds)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Transform: pick last message, count unread
  return (data ?? []).map((conv) => {
    const myMembership = conv.members?.find((m: any) => m.user_id === userId);
    const lastReadAt = myMembership?.last_read_at ?? conv.created_at;
    const messages = conv.messages ?? [];
    // Sort messages by created_at desc, pick first as lastMessage
    const sorted = [...messages].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const raw = sorted[0];
    const lastMessage = raw
      ? {
          id: raw.id,
          conversationId: conv.id,
          senderId: raw.sender_id,
          content: raw.content,
          createdAt: raw.created_at,
        }
      : undefined;
    const unreadCount = messages.filter(
      (m: any) => m.sender_id !== userId && new Date(m.created_at) > new Date(lastReadAt),
    ).length;

    return {
      ...conv,
      messages: undefined,
      lastMessage,
      unreadCount,
    };
  });
}

export async function createDirectConversation(userId: string, contactUserId: string) {
  // Check for existing direct conversation
  const existing = await findExistingDirectConversation(userId, contactUserId);
  if (existing) return existing;

  // Create conversation
  const { data: conv, error: convError } = await supabaseAdmin
    .from('conversations')
    .insert({ type: 'direct' })
    .select()
    .single();

  if (convError) throw convError;

  // Add both members
  const { error: memError } = await supabaseAdmin
    .from('conversation_members')
    .insert([
      { conversation_id: conv.id, user_id: userId },
      { conversation_id: conv.id, user_id: contactUserId },
    ]);

  if (memError) throw memError;

  // Return with members
  return getConversation(conv.id, userId);
}

export async function getConversation(conversationId: string, userId: string) {
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

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select(`
      *,
      members:conversation_members(*, user:users(id, display_name, avatar_url, preferred_lang, native_lang))
    `)
    .eq('id', conversationId)
    .single();

  if (error) throw error;
  return data;
}

export async function findExistingDirectConversation(userId: string, contactUserId: string) {
  // Find conversations where both users are members and type is 'direct'
  const { data: myConvs, error: err1 } = await supabaseAdmin
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId);

  if (err1) throw err1;
  if (!myConvs || myConvs.length === 0) return null;

  const myConvIds = myConvs.map((m) => m.conversation_id);

  const { data: shared, error: err2 } = await supabaseAdmin
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', contactUserId)
    .in('conversation_id', myConvIds);

  if (err2) throw err2;
  if (!shared || shared.length === 0) return null;

  // Check which are direct
  const sharedIds = shared.map((m) => m.conversation_id);
  const { data: directConv, error: err3 } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .in('id', sharedIds)
    .eq('type', 'direct')
    .limit(1)
    .single();

  if (err3 || !directConv) return null;

  return getConversation(directConv.id, userId);
}
