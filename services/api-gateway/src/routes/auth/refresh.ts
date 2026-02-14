import type { FastifyInstance } from 'fastify';
import { refreshBody } from '../../schemas/auth.js';
import { supabaseAdmin } from '../../config/supabase.js';

export default async function refreshRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/refresh', async (request, reply) => {
    const body = refreshBody.parse(request.body);

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: body.refreshToken,
    });

    if (error || !data.session) {
      reply.code(401).send({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: error?.message ?? 'Failed to refresh session.',
        },
      });
      return;
    }

    return {
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
      },
    };
  });
}
