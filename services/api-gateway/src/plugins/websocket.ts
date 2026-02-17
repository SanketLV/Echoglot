import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';

async function websocketPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(websocket);
}

export default fp(websocketPlugin, { name: 'websocket' });
