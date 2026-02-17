import type { TranslationEngine, TranslationResult } from './types.js';
import { TranslationCache } from './cache.js';
import { MockEngine } from './engines/mock.js';
import { DeepLEngine } from './engines/deepl.js';
import { GoogleEngine } from './engines/google.js';
import { env } from '../../config/env.js';

// European languages prefer DeepL
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

    if (env.DEEPL_API_KEY) {
      this.engines.push(new DeepLEngine(env.DEEPL_API_KEY));
    }

    if (env.GOOGLE_TRANSLATE_API_KEY) {
      this.engines.push(new GoogleEngine(env.GOOGLE_TRANSLATE_API_KEY));
    }

    // Always have mock as last fallback
    this.engines.push(new MockEngine());
  }

  private pickEngine(sourceLang: string, targetLang: string): TranslationEngine {
    if (env.TRANSLATION_MOCK) {
      return this.engines[0]!;
    }

    // Prefer DeepL for European languages
    if (DEEPL_PREFERRED.has(sourceLang) && DEEPL_PREFERRED.has(targetLang)) {
      const deepl = this.engines.find((e) => e.name === 'deepl');
      if (deepl) return deepl;
    }

    // Google for everything else
    const google = this.engines.find((e) => e.name === 'google');
    if (google) return google;

    // Fallback to last engine (always mock)
    return this.engines[this.engines.length - 1]!;
  }

  async translate(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult> {
    if (sourceLang === targetLang) {
      return { translatedText: text, sourceLang, targetLang, engine: 'passthrough', cached: false };
    }

    // Check cache
    const cached = await this.cache.get(text, sourceLang, targetLang);
    if (cached) return cached;

    // Pick engine and translate
    const engine = this.pickEngine(sourceLang, targetLang);
    const result = await engine.translate({ text, sourceLang, targetLang });

    // Cache result
    await this.cache.set(text, sourceLang, targetLang, result);

    return result;
  }
}
