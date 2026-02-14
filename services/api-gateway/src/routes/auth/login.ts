import type { FastifyInstance } from 'fastify';
import { loginBody } from '../../schemas/auth.js';
import { supabaseAdmin } from '../../config/supabase.js';

export default async function loginRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/login', async (request, reply) => {
    const body = loginBody.parse(request.body);

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      reply.code(401).send({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message,
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
        user: {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata['display_name'] as string | undefined,
        },
      },
    };
  });
}
