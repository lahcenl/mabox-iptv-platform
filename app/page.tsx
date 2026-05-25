import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import CategoryCard from '@/components/ui/CategoryCard';
import ProductCard from '@/components/ui/ProductCard';
import { categories, getFeaturedProducts } from '@/lib/data';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO SECTION ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Premium Digital Subscriptions & IPTV Activations
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Fast delivery, stable servers, and 24/7 support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-sm w-full sm:w-auto"
            >
              Browse Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all shadow-sm w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Browse by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Featured Plans
          </h2>
          <p className="text-gray-500 mt-2 text-base">Hand-picked plans our customers love most</p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                View All Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-base">No featured plans available right now.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Browse All Plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
