'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale } from '@/lib/translations';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localize: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem('language') as Locale;
    if (storedLocale && ['en', 'ar', 'fr'].includes(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('language', newLocale);
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

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, localize }}>
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
