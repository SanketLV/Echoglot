import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../plugins/auth.js';
import listContactsRoute from './list.js';
import createContactRoute from './create.js';
import updateContactRoute from './update.js';
import deleteContactRoute from './delete.js';

export default async function contactRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate);

  await fastify.register(listContactsRoute);
  await fastify.register(createContactRoute);
  await fastify.register(updateContactRoute);
  await fastify.register(deleteContactRoute);
}
