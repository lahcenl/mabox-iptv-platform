import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import fr from '@/locales/fr.json';

export const translations = {
  en,
  ar,
  fr,
} as const;

export type Locale = keyof typeof translations;
