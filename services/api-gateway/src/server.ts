import './config/env.js';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env.js';
import authPlugin from './plugins/auth.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import healthRoutes from './routes/health/index.js';
import authRoutes from './routes/auth/index.js';
import userRoutes from './routes/users/index.js';
import contactRoutes from './routes/contacts/index.js';

async function main(): Promise<void> {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport:
        process.env['NODE_ENV'] !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // Plugins
  await fastify.register(cors, { origin: env.CORS_ORIGIN, credentials: true });
  await fastify.register(errorHandlerPlugin);
  await fastify.register(authPlugin);

  // Routes - all under /v1
  await fastify.register(
    async (v1) => {
      await v1.register(healthRoutes);
      await v1.register(authRoutes, { prefix: '/auth' });
      await v1.register(userRoutes, { prefix: '/users' });
      await v1.register(contactRoutes, { prefix: '/contacts' });
    },
    { prefix: '/v1' },
  );

  try {
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
