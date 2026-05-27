'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import { useTranslations } from '@/components/context/LanguageContext';
import type { Article } from '@/lib/articles';

// Lightweight Markdown -> HTML renderer (no dependencies)
function renderMarkdown(md: string): string {
  if (!md) return '';
  return md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-violet-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-violet-600 underline hover:text-violet-800" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-violet-300 pl-4 italic text-gray-600 my-4">$1</blockquote>')
    // Paragraphs (blank line separation)
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed my-4">')
    // Wrap in initial paragraph
    .replace(/^/, '<p class="text-gray-700 leading-relaxed my-4">')
    .replace(/$/, '</p>');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticleContent({ article }: { article: Article }) {
  const { t, locale, getLocalizedValue } = useTranslations();

  const title = getLocalizedValue(article, 'title') || article.title;
  const content = getLocalizedValue(article, 'content') || article.content;
  const htmlContent = renderMarkdown(content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {locale === 'ar' ? 'العودة للمدونة' : locale === 'fr' ? 'Retour au Blog' : 'Back to Blog'}
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Cover Image */}
        {article.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-md aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
          {title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-8 text-center text-white shadow-lg shadow-violet-200">
          <h2 className="text-xl font-bold mb-2">
            {locale === 'ar' ? 'هل أنت مستعد للبدء؟' : locale === 'fr' ? 'Prêt à commencer ?' : 'Ready to get started?'}
          </h2>
          <p className="text-violet-100 text-sm mb-5">
            {locale === 'ar'
              ? 'تصفح خطط IPTV الممتازة لدينا مع تفعيل فوري.'
              : locale === 'fr'
              ? 'Parcourez nos plans IPTV premium avec activation instantanée.'
              : 'Browse our premium IPTV plans with instant activation.'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors shadow-sm"
          >
            {locale === 'ar' ? 'تصفح الخطط' : locale === 'fr' ? 'Découvrir les plans' : 'Browse Plans'}
          </Link>
        </div>
      </div>
    </div>
  );
}
