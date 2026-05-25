import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { categories, getProductsByCategory } from '@/lib/data';

export default async function Home() {
  const iptvProducts = (await getProductsByCategory('IPTV Subscriptions')).slice(0, 4);
  const mediaPlayers = (await getProductsByCategory('Media Players')).slice(0, 4);
  const beinSports = (await getProductsByCategory('Bein Sports')).slice(0, 4);

  const coreCategories = categories.filter(
    (c) => c.slug === 'iptv-subscriptions' || c.slug === 'media-players' || c.slug === 'bein-sports'
  );

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
      <section className="max-w-4xl mx-auto px-4 py-10 md:py-16 border-b border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-gray-500 mt-2 text-xs md:text-sm">Explore our premium plans and software licenses</p>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 md:pb-0 md:grid md:grid-cols-3 justify-start md:justify-items-center max-w-3xl mx-auto px-2">
          {coreCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ── CATEGORIZED ROWS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Row 1: IPTV Subscriptions */}
        <div>
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-gray-200/60">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                IPTV Subscriptions
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Premium channels, instant activation, and crystal-clear quality</p>
            </div>
            <Link
              href="/products?category=iptv-subscriptions"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors whitespace-nowrap group"
            >
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          {iptvProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {iptvProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No products found in this category.</p>
          )}
        </div>

        {/* Row 2: Media Players */}
        <div>
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-gray-200/60">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Media Players
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Enhance your streaming experience with top-tier player licenses</p>
            </div>
            <Link
              href="/products?category=media-players"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors whitespace-nowrap group"
            >
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          {mediaPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaPlayers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No products found in this category.</p>
          )}
        </div>

        {/* Row 3: Bein Sports */}
        <div>
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-gray-200/60">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Bein Sports
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Live coverage of premium worldwide sports and tournaments</p>
            </div>
            <Link
              href="/products?category=bein-sports"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors whitespace-nowrap group"
            >
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          {beinSports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {beinSports.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No products found in this category.</p>
          )}
        </div>

      </section>
    </div>
  );
}
