'use client';

import { Send, MessageCircle } from 'lucide-react';
import { useTranslations } from '@/components/context/LanguageContext';

export default function CommunityBanner({ locale }: { locale: string }) {
  const { t } = useTranslations();

  return (
    <section className="bg-gray-100 border-t border-b border-gray-200/50 py-6 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left rtl:sm:text-right">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm sm:text-base">
              {t('community.title')}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              {t('community.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
