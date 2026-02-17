export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  engine: string;
  cached: boolean;
}

export interface TranslationEngine {
  name: string;
  supportedPairs(): string[][];
  translate(request: TranslationRequest): Promise<TranslationResult>;
}
