import type { TranslationEngine, TranslationRequest, TranslationResult } from '../types.js';

// MyMemory — free translation API, no API key required.
// Free tier: 5,000 chars/day. More than enough for development.
// Docs: https://mymemory.translated.net/doc/spec.php
export class MyMemoryEngine implements TranslationEngine {
  name = 'mymemory';

  supportedPairs(): string[][] {
    // Supports all language pairs
    return [];
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const url =
      `https://api.mymemory.translated.net/get` +
      `?q=${encodeURIComponent(request.text)}` +
      `&langpair=${request.sourceLang}|${request.targetLang}`;

    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      throw new Error(`MyMemory HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as {
      responseStatus: number;
      responseMessage?: string;
      responseData: { translatedText: string };
    };

    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory translation failed: ${data.responseMessage ?? data.responseStatus}`);
    }

    return {
      translatedText: data.responseData.translatedText,
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      engine: this.name,
      cached: false,
    };
  }
}
