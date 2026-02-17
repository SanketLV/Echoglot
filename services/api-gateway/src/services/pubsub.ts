import { Redis } from 'ioredis';
import { env } from '../config/env.js';

type MessageHandler = (message: string) => void;

export class PubSub {
  private sub: Redis | null = null;
  private pub: Redis | null = null;
  private handlers = new Map<string, MessageHandler>();

  constructor() {
    if (env.REDIS_URL) {
      this.sub = new Redis(env.REDIS_URL);
      this.pub = new Redis(env.REDIS_URL);
    }
  }

  async subscribe(userId: string, handler: MessageHandler): Promise<void> {
    if (!this.sub) return;

    const channel = `user:${userId}`;
    this.handlers.set(channel, handler);

    this.sub.on('message', (ch: string, message: string) => {
      const h = this.handlers.get(ch);
      if (h) h(message);
    });

    await this.sub.subscribe(channel);
  }

  async publish(userId: string, event: unknown): Promise<void> {
    if (!this.pub) return;

    const channel = `user:${userId}`;
    await this.pub.publish(channel, JSON.stringify(event));
  }

  async unsubscribe(userId: string): Promise<void> {
    if (!this.sub) return;

    const channel = `user:${userId}`;
    await this.sub.unsubscribe(channel);
    this.handlers.delete(channel);
  }

  async cleanup(): Promise<void> {
    if (this.sub) {
      this.sub.disconnect();
    }
    if (this.pub) {
      this.pub.disconnect();
    }
  }
}

// Each WS connection gets its own PubSub instance for the subscriber
// because ioredis subscriber can't do other commands
export function createPubSub(): PubSub {
  return new PubSub();
}
