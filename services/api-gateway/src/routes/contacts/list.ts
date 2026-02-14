import type { FastifyInstance } from 'fastify';
import { getContacts } from '../../db/contacts.js';

export default async function listContactsRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const contacts = await getContacts(request.user.id);

    return { success: true, data: contacts };
  });
}
