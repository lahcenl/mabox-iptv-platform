'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslations } from '@/components/context/LanguageContext';

export default function HeroSection() {
  const { t } = useTranslations();

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white pt-6 pb-6 md:pt-12 md:pb-14 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-sm w-full sm:w-auto"
          >
            {t('hero.ctaBrowse')} <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${t('common.whatsappNumber')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all shadow-sm w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            {t('hero.ctaWhatsApp')}
          </a>
        </div>
      </div>
    </section>
  );
}
