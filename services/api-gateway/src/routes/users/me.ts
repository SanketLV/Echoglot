import type { FastifyInstance } from 'fastify';
import { getUserById, updateUser, deleteUser } from '../../db/users.js';
import { updateProfileBody } from '../../schemas/user.js';

export default async function userMeRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/me', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const user = await getUserById(request.user.id);

    return { success: true, data: user };
  });

  fastify.patch('/me', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const body = updateProfileBody.parse(request.body);
    const updated = await updateUser(request.user.id, body);

    return { success: true, data: updated };
  });

  fastify.delete('/me', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    await deleteUser(request.user.id);

    return { success: true, data: { message: 'Account deleted successfully.' } };
  });
}
