import { createHash } from 'node:crypto';
import { Redis } from 'ioredis';
import type { TranslationResult } from './types.js';

const CACHE_TTL = 3600; // 1 hour

export class TranslationCache {
  private redis: Redis | null = null;

  constructor(redisUrl?: string) {
    if (redisUrl) {
      this.redis = new Redis(redisUrl);
    }
  }

  private key(text: string, sourceLang: string, targetLang: string): string {
    const hash = createHash('sha256').update(text).digest('hex').slice(0, 16);
    return `translation:${hash}:${sourceLang}:${targetLang}`;
  }

  async get(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult | null> {
    if (!this.redis) return null;

    const cached = await this.redis.get(this.key(text, sourceLang, targetLang));
    if (!cached) return null;

    const result = JSON.parse(cached) as TranslationResult;
    return { ...result, cached: true };
  }

  async set(text: string, sourceLang: string, targetLang: string, result: TranslationResult): Promise<void> {
    if (!this.redis) return;

    await this.redis.setex(
      this.key(text, sourceLang, targetLang),
      CACHE_TTL,
      JSON.stringify(result),
    );
  }
}
