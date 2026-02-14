import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../plugins/auth.js';
import { supabaseAdmin } from '../../config/supabase.js';

export default async function logoutRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/logout', { preHandler: [authenticate] }, async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    const { error } = await supabaseAdmin.auth.admin.signOut(request.user.id);

    if (error) {
      reply.code(500).send({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: error.message,
        },
      });
      return;
    }

    return { success: true, data: { message: 'Logged out successfully.' } };
  });
}
