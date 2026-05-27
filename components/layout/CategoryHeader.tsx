'use client';

import { useTranslations } from '@/components/context/LanguageContext';

export default function CategoryHeader() {
  const { t } = useTranslations();

  return (
    <div className="mb-4 text-center">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
        {t('categories.title')}
      </h2>
      <p className="text-gray-500 mt-1 text-xs">{t('categories.subtitle')}</p>
    </div>
  );
}
