import Link from 'next/link';
import { Category } from '@/lib/data';

interface CategoryCardProps {
  category: Category;
}

const colorMap = {
  purple: {
    border: 'border-violet-600',
    bg: 'bg-violet-600',
    emoji: '📡',
    label: 'IPTV',
  },
  yellow: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-500',
    emoji: '📺',
    label: 'Players',
  },
  blue: {
    border: 'border-blue-600',
    bg: 'bg-blue-600',
    emoji: '📱',
    label: 'Smart TV',
  },
  green: {
    border: 'border-green-600',
    bg: 'bg-green-600',
    emoji: '🏪',
    label: 'Reseller',
  },
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const style = colorMap[category.color];

  return (
    <Link href={`/products?category=${category.slug}`} className="group block h-full">
      <div
        className={`bg-white rounded-2xl border-4 ${style.border} h-72 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      >
        {/* Center content: Emoji on white background */}
        <div className="flex-1 flex items-center justify-center bg-white p-6">
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
            {style.emoji}
          </div>
        </div>

        {/* Bottom solid colored block */}
        <div
          className={`w-full ${style.bg} py-4 text-center font-bold text-white text-lg tracking-wide uppercase`}
        >
          {style.label}
        </div>
      </div>
    </Link>
  );
}

