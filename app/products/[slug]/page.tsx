import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getProducts, getProductsByCategory } from '@/lib/data';
import ProductDetails from '@/components/product/ProductDetails';
import ProductDescription from '@/components/product/ProductDescription';
import ProductCard from '@/components/ui/ProductCard';
// No locales/localizePath import needed

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ondexy.com';

/** Strip Markdown syntax so meta descriptions are clean plain text for SEO */
function stripMarkdown(md: string | null | undefined): string {
  if (!md || typeof md !== 'string') return '';
  try {
    return md
      .replace(/#{1,6}\s*/g, '')           // headings
      .replace(/\*\*(.+?)\*\*/g, '$1')    // bold
      .replace(/\*(.+?)\*/g, '$1')        // italic
      .replace(/`(.+?)`/g, '$1')          // inline code
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
      .replace(/^[-*+]\s+/gm, '')          // bullets
      .replace(/^\d+\.\s+/gm, '')          // numbered lists
      .replace(/\n{2,}/g, ' ')             // blank lines -> space
      .replace(/\n/g, ' ')                 // newlines -> space
      .trim();
  } catch {
    return '';
  }
}

// This tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const plainDescription = stripMarkdown(product?.description || '');
  const tiers = product.priceTiers || (product as any).price_tiers || [];
  const lowestPrice = tiers.length > 0 ? Math.min(...tiers.map((t: any) => t.price)) : 0;
  const imageUrl = product.image
    ? `${BASE_URL}${product.image}`
    : `${BASE_URL}/og-default.png`;

  return {
    title: product.name,
    description: plainDescription,
    keywords: [product.name, product.category, 'IPTV', 'buy IPTV', 'streaming'],
    alternates: {
      canonical: `${BASE_URL}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Ondexy`,
      description: plainDescription,
      type: 'website',
      url: `${BASE_URL}/products/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Ondexy`,
      description: plainDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage(props: any) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products (same category, exclude current)
  const products = await getProducts();
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Cross-selling: pick a complementary category
  const crossCategory =
    product.category === 'IPTV Subscriptions'
      ? 'Players IPTV'
      : product.category === 'Players IPTV'
      ? 'IPTV Subscriptions'
      : products.find((p) => p.category !== product.category)?.category ?? null;

  const crossSell = crossCategory
    ? (await getProductsByCategory(crossCategory))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];

  // Lowest price tier for schema
  const tiers = product.priceTiers || (product as any).price_tiers || [];
  const lowestPrice = tiers.length > 0 ? Math.min(...tiers.map((t: any) => t.price)) : 0;
  const imageUrl = product.image
    ? `${BASE_URL}${product.image}`
    : `${BASE_URL}/og-default.png`;

  // JSON-LD Product schema
  const plainDesc = stripMarkdown(product?.description || '');
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: plainDesc,
    image: imageUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Ondexy',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: lowestPrice.toFixed(2),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Ondexy',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-violet-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-violet-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product detail (image + pricing + CTA) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10">
        <ProductDetails product={product} />
      </div>

      {/* Description — full-width, rendered BELOW images / pricing / cart buttons */}
      <ProductDescription description={product.description} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Cross-selling: Customers who bought this also bought */}
      {crossSell.length > 0 && (
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Customers who bought this also bought
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              From the <span className="font-semibold text-violet-600">{crossCategory}</span> category
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {crossSell.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
