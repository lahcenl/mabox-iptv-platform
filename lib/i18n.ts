export const locales = ['en', 'ar', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = 'en';

const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  ar: () => import('@/locales/ar.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};

export const getDictionary = async (locale: Locale) => {
  if (!hasLocale(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
};

export function localizePath(path: string, locale: string): string {
  if (locale === defaultLocale || !locale) return path;
  if (
    path.startsWith('http') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}
