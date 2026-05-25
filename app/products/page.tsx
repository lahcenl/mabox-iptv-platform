import type { Metadata } from 'next';
import ProductCard from '@/components/ui/ProductCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { getProducts, categories } from '@/lib/data';
import { Grid3X3, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse all IPTV subscriptions, media players, and reseller panels. Best prices guaranteed.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  let products = await getProducts();

  if (category) {
    const matchedCategory = categories.find((c) => c.slug === category);
    if (matchedCategory) {
      products = products.filter((p) => p.category === matchedCategory.name);
    }
  }

  if (search) {
    const query = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          All Products
        </h1>
        <p className="text-gray-500">
          Showing {products.length} subscription plans & services
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-violet-600" />
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400 font-medium flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          All Plans
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
