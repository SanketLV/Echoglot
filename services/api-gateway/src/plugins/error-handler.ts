import type { FastifyInstance, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

async function errorHandlerPlugin(fastify: FastifyInstance): Promise<void> {
  fastify.setErrorHandler((error: FastifyError | Error, _request, reply) => {
    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));

      reply.code(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed.',
          details,
        },
      });
      return;
    }

    if ('statusCode' in error && error.statusCode === 401) {
      reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error.message || 'Unauthorized.',
        },
      });
      return;
    }

    if ('statusCode' in error && error.statusCode === 404) {
      reply.code(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'Resource not found.',
        },
      });
      return;
    }

    console.error('[error-handler] Unhandled error:', error);

    reply.code(500).send({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
    });
  });
}

export default fp(errorHandlerPlugin, { name: 'error-handler' });
