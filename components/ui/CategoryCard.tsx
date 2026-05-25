import Link from 'next/link';
import { Category } from '@/lib/data';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex flex-col items-center text-center transition-all duration-300 w-full"
      aria-label={`Browse ${category.name}`}
    >
      {/* Sleek, circular avatar badge */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-violet-600 transition-all duration-300 shadow-md group-hover:shadow-lg bg-gray-50 flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Subtle shadow/hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      </div>

      {/* Category Name centered strictly underneath */}
      <span className="mt-3 text-xs md:text-sm font-bold text-gray-800 group-hover:text-violet-600 transition-colors leading-tight line-clamp-2 max-w-[120px]">
        {category.name}
      </span>
    </Link>
  );
}
