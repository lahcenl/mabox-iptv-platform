import type { Metadata } from 'next';
import { readArticles } from '@/lib/articles';
import { cookies } from 'next/headers';
import BlogClient from '@/components/blog/BlogClient';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get('language')?.value || 'en';

    const titles = {
      en: 'Blog – IPTV Guides, Tips & News',
      ar: 'المدونة – أدلة ونصائح وأخبار IPTV',
      fr: 'Blog – Guides, astuces et actualités IPTV',
    };
    const descriptions = {
      en: 'Expert articles on IPTV setup, streaming tips, device guides, and the latest news from Ondexy.',
      ar: 'مقالات الخبراء حول إعداد IPTV، ونصائح البث، وأدلة الأجهزة، وأحدث الأخبار من أندكسي.',
      fr: 'Articles d\'experts sur la configuration de l\'IPTV, conseils de streaming, guides d\'appareils et dernières actualités d\'Ondexy.',
    };

    const title = titles[locale as keyof typeof titles] || titles.en;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
    };
  } catch (err) {
    console.error("Metadata Generation Error (Blog list):", err);
    return { title: 'Ondexy Blog' };
  }
}

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let articles: any[] = [];
  
  try {
    articles = await readArticles();
    
    console.log("Fetched Articles List:", {
      count: articles.length,
      articles
    });
  } catch (err) {
    console.error("Page Load Error (BlogPage data fetch):", err);
  }

  return <BlogClient initialArticles={articles} />;
}

