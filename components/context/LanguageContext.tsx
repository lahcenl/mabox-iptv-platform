'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale } from '@/lib/translations';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localize: (path: string) => string;
  getLocalizedValue: (item: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export function getLocalizedField(item: any, field: string, currentLocale: string): string {
  if (!item) return '';
  const localizedKey = `${field}_${currentLocale}`;
  const englishKey = `${field}_en`;
  return item[localizedKey] || item[englishKey] || item[field] || '';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem('language') as Locale;
    if (storedLocale && ['en', 'ar', 'fr'].includes(storedLocale)) {
      setLocaleState(storedLocale);
      document.cookie = `language=${storedLocale}; path=/; max-age=31536000`;
    } else {
      document.cookie = `language=en; path=/; max-age=31536000`;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('language', newLocale);
    document.cookie = `language=${newLocale}; path=/; max-age=31536000`;
  };

  const t = (key: string): string => {
    try {
      const dict = translations[locale] || translations['en'];
      const parts = key.split('.');
      let result: any = dict;
      for (const part of parts) {
        if (result === undefined || result === null) {
          return key;
        }
        result = result[part];
      }
      return typeof result === 'string' ? result : key;
    } catch {
      return key;
    }
  };

  const localize = (path: string) => path;

  const getLocalizedValue = (item: any, field: string): string => {
    return getLocalizedField(item, field, locale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, localize, getLocalizedValue }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslations() {
  return useLanguage();
}
