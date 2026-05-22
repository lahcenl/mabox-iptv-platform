import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import type { Product } from '@/lib/data';
import type { Article } from '@/lib/articles';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://iptvstore.com';

function readProducts(): Product[] {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'products.json'), 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

async function readArticles(): Promise<Article[]> {
  try {
    const { readArticles: read } = await import('@/lib/articles');
    return await read();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = readProducts();
  const articles = await readArticles();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic product routes
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic article/blog routes
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
