'use client';

import Link from 'next/link';
import { Star, MessageCircle, Settings2 } from 'lucide-react';
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.floor(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : star - 0.5 <= rating
              ? 'text-yellow-400 fill-yellow-200'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

const categoryEmojis: Record<string, string> = {
  'IPTV Subscriptions': '📡',
  'Media Players': '📺',
  'Smart TV Apps': '📱',
  'Reseller Panels': '🏪',
};

export default function ProductCard({ product }: ProductCardProps) {
  const firstTier = product.priceTiers.length > 0 ? product.priceTiers[0] : null;
  const whatsappMessage = `Hi! I'm interested in ${product.name}. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/${product.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const emoji = categoryEmojis[product.category] || '📦';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image area */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative h-48 bg-white flex items-center justify-center overflow-hidden border-b border-gray-100">
          <div className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-500">
            {emoji}
          </div>
          {/* Category badge */}
          <span className="absolute top-3 left-3 bg-gray-50 text-violet-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-gray-200">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-bold text-gray-900 mb-1 hover:text-violet-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {/* Price — first available tier */}
        <div className="mb-4 flex-1">
          {firstTier ? (
            <span className="text-lg font-extrabold text-violet-700">
              {firstTier.duration} - ${firstTier.price}
            </span>
          ) : (
            <span className="text-sm text-gray-400">No plans available</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
          >
            <Settings2 className="w-4 h-4 text-gray-500" />
            Select options
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp us
          </a>
        </div>
      </div>
    </div>
  );
}

