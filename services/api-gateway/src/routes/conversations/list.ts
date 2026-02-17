import type { FastifyInstance } from 'fastify';
import { listConversations } from '../../db/conversations.js';

export default async function listConversationsRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async (request) => {
    if (!request.user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };
    }

    const conversations = await listConversations(request.user.id);
    return { success: true, data: conversations };
  });
}
