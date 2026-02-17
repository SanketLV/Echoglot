import { TranslationRouter } from './router.js';
import type { TranslationResult } from './types.js';

export type { TranslationRequest, TranslationResult, TranslationEngine } from './types.js';

let router: TranslationRouter | null = null;

function getRouter(): TranslationRouter {
  if (!router) {
    router = new TranslationRouter();
  }
  return router;
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<TranslationResult> {
  return getRouter().translate(text, sourceLang, targetLang);
}
