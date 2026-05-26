'use client';

import React, { createContext, useContext } from 'react';
import { localizePath } from '@/lib/i18n';

type Dictionary = any;

interface I18nContextProps {
  locale: string;
  t: (key: string) => string;
  localize: (path: string) => string;
}

const I18nContext = createContext<I18nContextProps | null>(null);

export function I18nProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: string;
  dictionary: Dictionary;
}) {
  const t = (key: string): string => {
    try {
      const parts = key.split('.');
      let result = dictionary;
      for (const part of parts) {
        result = result[part];
      }
      return typeof result === 'string' ? result : key;
    } catch {
      return key;
    }
  };

  const localize = (path: string) => localizePath(path, locale);

  return (
    <I18nContext.Provider value={{ locale, t, localize }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context;
}
