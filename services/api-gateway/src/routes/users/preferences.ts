import type { FastifyInstance } from 'fastify';
import { getPreferences, upsertPreferences } from '../../db/preferences.js';
import { updatePreferencesBody } from '../../schemas/user.js';

export default async function preferencesRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/preferences', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const prefs = await getPreferences(request.user.id);

    return { success: true, data: prefs };
  });

  fastify.patch('/preferences', async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const body = updatePreferencesBody.parse(request.body);
    const updated = await upsertPreferences(request.user.id, body);

    return { success: true, data: updated };
  });
}
