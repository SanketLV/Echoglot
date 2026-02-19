import type { TranslationEngine, TranslationResult } from './types.js';
import { TranslationCache } from './cache.js';
import { MockEngine } from './engines/mock.js';
import { MyMemoryEngine } from './engines/mymemory.js';
import { DeepLEngine } from './engines/deepl.js';
import { GoogleEngine } from './engines/google.js';
import { env } from '../../config/env.js';

// European languages where DeepL performs best
const DEEPL_PREFERRED = new Set(['en', 'es', 'fr', 'de', 'pt', 'ko', 'ja', 'zh']);

export class TranslationRouter {
  private engines: TranslationEngine[] = [];
  private cache: TranslationCache;

  constructor() {
    this.cache = new TranslationCache(env.REDIS_URL);

    if (env.TRANSLATION_MOCK) {
      this.engines.push(new MockEngine());
      return;
    }

    // Real engines in priority order
    if (env.DEEPL_API_KEY) {
      this.engines.push(new DeepLEngine(env.DEEPL_API_KEY));
    }

    if (env.GOOGLE_TRANSLATE_API_KEY) {
      this.engines.push(new GoogleEngine(env.GOOGLE_TRANSLATE_API_KEY));
    }

    // MyMemory: free, no API key needed — always available as fallback
    this.engines.push(new MyMemoryEngine());
  }

  private pickEngine(sourceLang: string, targetLang: string): TranslationEngine {
    if (env.TRANSLATION_MOCK) return this.engines[0]!;

    // Prefer DeepL for European languages when available
    if (DEEPL_PREFERRED.has(sourceLang) && DEEPL_PREFERRED.has(targetLang)) {
      const deepl = this.engines.find((e) => e.name === 'deepl');
      if (deepl) return deepl;
    }

    // Google for everything else when available
    const google = this.engines.find((e) => e.name === 'google');
    if (google) return google;

    // MyMemory always available
    return this.engines[this.engines.length - 1]!;
  }

  async translate(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult> {
    if (sourceLang === targetLang) {
      return { translatedText: text, sourceLang, targetLang, engine: 'passthrough', cached: false };
    }

    // Check cache
    const cached = await this.cache.get(text, sourceLang, targetLang);
    if (cached) return cached;

    const engine = this.pickEngine(sourceLang, targetLang);

    let result: TranslationResult;
    try {
      result = await engine.translate({ text, sourceLang, targetLang });
    } catch (err) {
      // If primary engine fails, fall back to MyMemory
      if (engine.name !== 'mymemory') {
        result = await new MyMemoryEngine().translate({ text, sourceLang, targetLang });
      } else {
        throw err;
      }
    }

    await this.cache.set(text, sourceLang, targetLang, result);
    return result;
  }
}
