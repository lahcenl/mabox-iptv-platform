import Link from 'next/link';
import { Category } from '@/lib/data';

interface CategoryCardProps {
  category: Category;
}

const accentColors: Record<Category['color'], string> = {
  purple: 'from-violet-600/90 to-violet-900/95',
  yellow: 'from-amber-500/90 to-amber-800/95',
  blue:   'from-blue-600/90 to-blue-900/95',
  green:  'from-emerald-600/90 to-emerald-900/95',
};

const borderColors: Record<Category['color'], string> = {
  purple: 'ring-violet-500',
  yellow: 'ring-amber-400',
  blue:   'ring-blue-500',
  green:  'ring-emerald-500',
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const gradient = accentColors[category.color];
  const ring     = borderColors[category.color];

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block h-full"
      aria-label={`Browse ${category.name}`}
    >
      <div
        className={`
          relative h-64 rounded-2xl overflow-hidden shadow-md
          ring-2 ring-transparent hover:${ring}
          transition-all duration-400 hover:-translate-y-1 hover:shadow-xl
          cursor-pointer
        `}
      >
        {/* Background image — always visible */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark gradient overlay — hidden by default, slides up on hover */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-t ${gradient}
            opacity-0 group-hover:opacity-100
            transition-opacity duration-350
          `}
        />

        {/* Product count badge — always visible */}
        <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {category.productCount} products
        </span>

        {/* Category name — revealed on hover with slide-up effect */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
          <p
            className={`
              text-white text-xl font-extrabold tracking-wide text-center leading-tight
              translate-y-4 opacity-0
              group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-350 delay-75
              drop-shadow-lg
            `}
          >
            {category.name}
          </p>
          <p
            className={`
              text-white/80 text-sm font-medium mt-1
              translate-y-4 opacity-0
              group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-350 delay-100
            `}
          >
            Shop now →
          </p>
        </div>
      </div>
    </Link>
  );
}
