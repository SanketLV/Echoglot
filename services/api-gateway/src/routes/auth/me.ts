import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../plugins/auth.js';

export default async function meRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    return {
      success: true,
      data: request.user,
    };
  });
}
