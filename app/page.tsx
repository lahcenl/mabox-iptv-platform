import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { categories, getProductsByCategory } from '@/lib/data';
import HeroSection from '@/components/layout/HeroSection';
import CategoryHeader from '@/components/layout/CategoryHeader';

export default async function Home() {
  const iptvProducts = (await getProductsByCategory('IPTV Subscriptions')).slice(0, 4);
  const mediaPlayers = (await getProductsByCategory('Players IPTV')).slice(0, 4);
  const beinSports = (await getProductsByCategory('beIN SPORTS')).slice(0, 4);

  const coreCategories = categories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO SECTION ── */}
      <HeroSection />

      {/* ── CATEGORIES ── */}
      <section className="max-w-4xl mx-auto px-4 py-6 md:py-8 border-b border-gray-100">
        <CategoryHeader />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center max-w-3xl mx-auto px-2">
          {coreCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ── CATEGORIZED ROWS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 my-2 md:py-10 space-y-8 md:space-y-16">
        
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {iptvProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No products found in this category.</p>
          )}
        </div>

        {/* Row 2: Players IPTV */}
        <div>
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-gray-200/60">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Players IPTV
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
                beIN SPORTS
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
