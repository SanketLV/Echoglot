import type { FastifyInstance } from 'fastify';
import { updateContact } from '../../db/contacts.js';
import { updateContactBody, contactIdParam } from '../../schemas/contact.js';

export default async function updateContactRoute(fastify: FastifyInstance): Promise<void> {
  fastify.patch('/:id', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const params = contactIdParam.parse(request.params);
    const body = updateContactBody.parse(request.body);
    const contact = await updateContact(params.id, request.user.id, body);

    return { success: true, data: contact };
  });
}
