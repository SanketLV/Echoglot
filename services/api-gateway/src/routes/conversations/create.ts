import type { FastifyInstance } from 'fastify';
import { createDirectConversation } from '../../db/conversations.js';
import { createConversationBody } from '../../schemas/conversation.js';

export default async function createConversationRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const body = createConversationBody.parse(request.body);
    const conversation = await createDirectConversation(request.user.id, body.contactId);

    reply.code(201);
    return { success: true, data: conversation };
  });
}
