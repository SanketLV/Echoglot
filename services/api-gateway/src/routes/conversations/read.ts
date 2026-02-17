import type { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../../config/supabase.js';
import { conversationIdParam } from '../../schemas/conversation.js';

export default async function readRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/:id/read', async (request) => {
    if (!request.user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };
    }

    const params = conversationIdParam.parse(request.params);

    const { error } = await supabaseAdmin
      .from('conversation_members')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', params.id)
      .eq('user_id', request.user.id);

    if (error) throw error;

    return { success: true };
  });
}
