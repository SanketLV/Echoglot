import { SubscriptionTier, SupportedLanguage, Theme } from './enums';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  preferredLang: SupportedLanguage;
  nativeLang: SupportedLanguage;
  onboardingComplete: boolean;
  subscriptionTier: SubscriptionTier;
  voiceProfileId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  preferredLang: SupportedLanguage;
  nativeLang: SupportedLanguage;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: Theme;
  notificationsEnabled: boolean;
  autoTranslate: boolean;
  defaultInputLang: SupportedLanguage;
  defaultOutputLang: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}
