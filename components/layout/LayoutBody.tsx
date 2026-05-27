'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/components/context/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrendingTicker from '@/components/ui/TrendingTicker';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import CommunityBanner from '@/components/layout/CommunityBanner';

export function LayoutBody({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-full flex flex-col bg-gray-50 antialiased font-[family-name:var(--font-inter)]"
    >
      <Header />
      <main className="flex-1">{children}</main>
      <TrendingTicker />
      <CommunityBanner locale={locale} />
      <Footer locale={locale} />
      <WhatsAppWidget />
    </div>
  );
}
