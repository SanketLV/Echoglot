import type { TranslationEngine, TranslationRequest, TranslationResult } from '../types.js';

const GOOGLE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export class GoogleEngine implements TranslationEngine {
  name = 'google';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  supportedPairs(): string[][] {
    // Google supports virtually all pairs
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
    const url = new URL(GOOGLE_API_URL);
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: request.text,
        source: request.sourceLang,
        target: request.targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json() as { data: { translations: { translatedText: string }[] } };

    return {
      translatedText: data.data.translations[0]!.translatedText,
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      engine: this.name,
      cached: false,
    };
  }
}
