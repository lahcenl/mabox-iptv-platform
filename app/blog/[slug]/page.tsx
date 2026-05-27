import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, readArticles } from '@/lib/articles';
import { cookies } from 'next/headers';
import { getLocalizedField } from '@/components/context/LanguageContext';
import ArticleContent from '@/components/blog/ArticleContent';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ondexy.com';

interface Props {
  params: Promise<{ slug: string }>;
}

function stripMarkdown(md: string): string {
  if (!md) return '';
  return md.replace(/[#*_`~\[\]]/g, '').trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  // Read language cookie for metadata translation fallback
  const cookieStore = await cookies();
  const locale = cookieStore.get('language')?.value || 'en';

  const title = getLocalizedField(article, 'title', locale) || article.title;
  const excerpt = getLocalizedField(article, 'excerpt', locale) || article.excerpt;

  const metaTitle = article.metaTitle || title;
  const metaDescription = article.metaDescription || stripMarkdown(excerpt);
  const keywords = article.seoKeywords
    ? article.seoKeywords.split(',').map((k: string) => k.trim())
    : ['IPTV', 'IPTV guide', 'streaming tips', title];

  const imageUrl = article.coverImage
    ? article.coverImage.startsWith('http')
      ? article.coverImage
      : `${BASE_URL}${article.coverImage}`
    : `${BASE_URL}/og-default.png`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical: `${BASE_URL}/blog/${article.slug}`,
    },
    openGraph: {
      title: `${metaTitle} | Ondexy`,
      description: metaDescription,
      type: 'article',
      url: `${BASE_URL}/blog/${article.slug}`,
      publishedTime: article.date,
      authors: [article.author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | Ondexy`,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const articles = await readArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleContent article={article} />;
}
