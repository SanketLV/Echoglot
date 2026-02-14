import type { FastifyInstance } from 'fastify';
import { createContact } from '../../db/contacts.js';
import { createContactBody } from '../../schemas/contact.js';

export default async function createContactRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const body = createContactBody.parse(request.body);
    const contact = await createContact(request.user.id, body.contactEmail);

    reply.code(201);
    return { success: true, data: contact };
  });
}
