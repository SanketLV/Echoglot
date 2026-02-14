import type { FastifyInstance } from 'fastify';
import { deleteContact } from '../../db/contacts.js';
import { contactIdParam } from '../../schemas/contact.js';

export default async function deleteContactRoute(fastify: FastifyInstance): Promise<void> {
  fastify.delete('/:id', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const params = contactIdParam.parse(request.params);
    await deleteContact(params.id, request.user.id);

    reply.code(204);
  });
}
