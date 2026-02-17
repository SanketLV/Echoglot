import type { FastifyInstance } from 'fastify';
import { getConversation } from '../../db/conversations.js';
import { conversationIdParam } from '../../schemas/conversation.js';

export default async function getConversationRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/:id', async (request) => {
    if (!request.user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };
    }

    const params = conversationIdParam.parse(request.params);
    const conversation = await getConversation(params.id, request.user.id);
    return { success: true, data: conversation };
  });
}
