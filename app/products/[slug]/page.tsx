import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, products } from '@/lib/data';
import ProductDetails from '@/components/product/ProductDetails';
import ProductCard from '@/components/ui/ProductCard';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://iptvstore.com';

// This tells Next.js which slugs to pre-render at build time
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const lowestPrice = Math.min(...product.priceTiers.map((t) => t.price));
  const imageUrl = product.image
    ? `${BASE_URL}${product.image}`
    : `${BASE_URL}/og-default.png`;

  return {
    title: product.name,
    description: product.description,
    keywords: [product.name, product.category, 'IPTV', 'buy IPTV', 'streaming'],
    alternates: {
      canonical: `${BASE_URL}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | IPTVStore`,
      description: product.description,
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
      title: `${product.name} | IPTVStore`,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products (same category, exclude current)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Lowest price tier for schema
  const lowestPrice = Math.min(...product.priceTiers.map((t) => t.price));
  const imageUrl = product.image
    ? `${BASE_URL}${product.image}`
    : `${BASE_URL}/og-default.png`;

  // JSON-LD Product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'IPTVStore',
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
        name: 'IPTVStore',
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

      {/* Product detail */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-12">
        <ProductDetails product={product} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
