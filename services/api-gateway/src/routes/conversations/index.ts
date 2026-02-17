import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../plugins/auth.js';
import listConversationsRoute from './list.js';
import createConversationRoute from './create.js';
import getConversationRoute from './get.js';
import messagesRoute from './messages.js';
import originalRoute from './original.js';
import readRoute from './read.js';

export default async function conversationRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate);

  await fastify.register(listConversationsRoute);
  await fastify.register(createConversationRoute);
  await fastify.register(getConversationRoute);
  await fastify.register(messagesRoute);
  await fastify.register(originalRoute);
  await fastify.register(readRoute);
}
