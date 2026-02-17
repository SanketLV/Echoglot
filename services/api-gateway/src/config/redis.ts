import { Redis } from 'ioredis';
import { env } from './env.js';

function createRedisClient(): Redis | null {
  if (!env.REDIS_URL) {
    console.warn('[redis] REDIS_URL not provided. Caching is disabled.');
    return null;
  }

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  client.on('error', (err: Error) => {
    console.error('[redis] Connection error:', err.message);
  });

  client.on('connect', () => {
    console.info('[redis] Connected successfully.');
  });

  client.connect().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[redis] Failed to connect:', message);
  });

  return client;
}

export const redis = createRedisClient();
