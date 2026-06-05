import type { MetadataRoute } from 'next';
import { getProducts, categories } from '@/lib/data';
import { readArticles } from '@/lib/articles';

const baseUrl = 'https://www.ondexy.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch products and articles concurrently
  const [products, articles] = await Promise.all([
    getProducts(),
    readArticles(),
  ]);

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 2. Product Categories Routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/products?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Dynamic Products Detail Routes
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => {
    const lastModDate = p.updatedAt ? new Date(p.updatedAt) : p.createdAt ? new Date(p.createdAt) : new Date();
    const finalLastMod = isNaN(lastModDate.getTime()) ? new Date() : lastModDate;
    
    return {
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: finalLastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  // 4. Dynamic Blog Posts Routes
  const blogPostRoutes: MetadataRoute.Sitemap = articles.map((a) => {
    const lastModDate = a.date ? new Date(a.date) : new Date();
    const finalLastMod = isNaN(lastModDate.getTime()) ? new Date() : lastModDate;

    return {
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: finalLastMod,
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogPostRoutes,
  ];
}

