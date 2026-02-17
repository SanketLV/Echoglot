import * as deepl from 'deepl-node';
import type { TranslationEngine, TranslationRequest, TranslationResult } from '../types.js';

// Map our language codes to DeepL language codes
const DEEPL_LANG_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ja: 'ja',
  zh: 'zh',
  pt: 'pt-BR',
  ko: 'ko',
};

// DeepL supports these European + some Asian languages well
const DEEPL_SUPPORTED = new Set(['en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'ko']);

export class DeepLEngine implements TranslationEngine {
  name = 'deepl';
  private translator: deepl.Translator;

  constructor(apiKey: string) {
    this.translator = new deepl.Translator(apiKey);
  }

  supportedPairs(): string[][] {
    const langs = Array.from(DEEPL_SUPPORTED);
    const pairs: string[][] = [];
    for (const source of langs) {
      for (const target of langs) {
        if (source !== target) pairs.push([source, target]);
      }
    }
    return pairs;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const sourceLang = DEEPL_LANG_MAP[request.sourceLang] ?? request.sourceLang;
    const targetLang = DEEPL_LANG_MAP[request.targetLang] ?? request.targetLang;

    const result = await this.translator.translateText(
      request.text,
      sourceLang as deepl.SourceLanguageCode,
      targetLang as deepl.TargetLanguageCode,
    );

    return {
      translatedText: result.text,
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      engine: this.name,
      cached: false,
    };
  }
}
