import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, readArticles } from '@/lib/articles';
import { cookies } from 'next/headers';
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
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return { title: 'Article Not Found' };

    // Read language cookie for metadata translation fallback
    const cookieStore = await cookies();
    const locale = cookieStore.get('language')?.value || 'en';

    // Strict dynamic fallback checks to ensure zero runtime crashes:
    const title = (article as any)[`title_${locale}`] || article.title_en || article.title || '';
    const excerpt = article.excerpt || '';

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
  } catch (err) {
    console.error("Metadata Generation Error (Article):", err);
    return { title: 'Ondexy Blog' };
  }
}

export async function generateStaticParams() {
  try {
    const articles = await readArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch (err) {
    console.error("Error in generateStaticParams (Articles):", err);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: Props) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) notFound();

    const cookieStore = await cookies();
    const locale = cookieStore.get('language')?.value || 'en';

    const title = (article as any)[`title_${locale}`] || article.title_en || article.title || '';
    const content = (article as any)[`content_${locale}`] || article.content_en || article.content || '';

    console.log("Fetched Article Data for Slug:", slug, {
      title,
      locale,
      article
    });

    return <ArticleContent article={article} />;
  } catch (err) {
    console.error("Page Load Error (ArticlePage):", err);
    notFound();
  }
}
