import type { FastifyInstance } from 'fastify';
import { getOriginalText } from '../../db/messages.js';
import { conversationIdParam, messageIdParam } from '../../schemas/conversation.js';

export default async function originalRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/:id/messages/:mid/original', async (request) => {
    if (!request.user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };
    }

    conversationIdParam.parse(request.params);
    const { mid } = messageIdParam.parse(request.params);
    const result = await getOriginalText(mid, request.user.id);
    return { success: true, data: result };
  });
}
