import Link from 'next/link';
import { Category } from '@/lib/data';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block h-full"
      aria-label={`Browse ${category.name}`}
    >
      <div
        className="relative h-64 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-gray-100"
      >
        {/* Background image — always visible, clear by default */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay and text (text hidden by default, overlay bg-black/0 by default) */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-2xl font-extrabold tracking-wide drop-shadow-md">
              {category.name}
            </h3>
            <p className="text-white/80 text-sm font-medium mt-2">
              {category.productCount} products →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
