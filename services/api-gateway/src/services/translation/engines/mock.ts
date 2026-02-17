import type { TranslationEngine, TranslationRequest, TranslationResult } from '../types.js';

export class MockEngine implements TranslationEngine {
  name = 'mock';

  supportedPairs(): string[][] {
    // Mock supports all pairs
    const langs = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'hi', 'ar', 'pt', 'ko'];
    const pairs: string[][] = [];
    for (const source of langs) {
      for (const target of langs) {
        if (source !== target) pairs.push([source, target]);
      }
    }
    return pairs;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    return {
      translatedText: `[${request.targetLang.toUpperCase()}] ${request.text}`,
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      engine: this.name,
      cached: false,
    };
  }
}
