import type { FastifyInstance } from 'fastify';
import { getMessages } from '../../db/messages.js';
import { conversationIdParam, messagesQuery } from '../../schemas/conversation.js';

export default async function messagesRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/:id/messages', async (request) => {
    if (!request.user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };
    }

    const params = conversationIdParam.parse(request.params);
    const query = messagesQuery.parse(request.query);
    const result = await getMessages(params.id, request.user.id, query.cursor, query.limit);
    return { success: true, data: result.messages, nextCursor: result.nextCursor };
  });
}
