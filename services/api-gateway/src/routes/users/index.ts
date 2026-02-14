import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../plugins/auth.js';
import userMeRoutes from './me.js';
import preferencesRoutes from './preferences.js';

export default async function userRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate);

  await fastify.register(userMeRoutes);
  await fastify.register(preferencesRoutes);
}
