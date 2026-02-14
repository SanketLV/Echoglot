import type { FastifyInstance } from 'fastify';
import { registerBody } from '../../schemas/auth.js';
import { supabaseAdmin } from '../../config/supabase.js';

export default async function registerRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post('/register', async (request, reply) => {
    const body = registerBody.parse(request.body);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        display_name: body.displayName,
      },
    });

    if (error) {
      reply.code(400).send({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message,
        },
      });
      return;
    }

    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          displayName: body.displayName,
        },
      },
    };
  });
}
