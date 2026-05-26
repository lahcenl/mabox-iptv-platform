'use client';

import { useState } from 'react';
import { ShoppingCart, MessageCircle, Star, Check, Shield, Zap, Headphones, ChevronDown } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/store/cartStore';

interface ProductDetailsProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-sm text-gray-400">({count} reviews)</span>
    </div>
  );
}

const features = [
  { icon: Zap, label: 'Instant Activation', color: 'text-yellow-500' },
  { icon: Shield, label: 'Anti-freeze Technology', color: 'text-blue-500' },
  { icon: Headphones, label: '24/7 Support', color: 'text-green-500' },
];

const categoryEmojis: Record<string, string> = {
  'IPTV Subscriptions': '📡',
  'Players IPTV': '📺',
  'beIN SPORTS': '⚽',
  'Reseller Panels': '🏪',
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCartStore();

  const validTiers = product?.priceTiers || [];
  const isFlatPrice =
    validTiers.length === 1 &&
    (validTiers[0].duration === 'One-time' || validTiers[0].duration === 'Lifetime');
  const minPrice = validTiers.length > 0 ? Math.min(...validTiers.map((t) => t.price)) : 0;
  const maxPrice = validTiers.length > 0 ? Math.max(...validTiers.map((t) => t.price)) : 0;
  
  const selectedTier = validTiers[selectedTierIndex] || { duration: 'No Plan', price: 0, months: 0 };
  const emoji = categoryEmojis[product?.category] || '📦';

  const whatsappMessage = `Hi! I want to buy *${product.name}* for *${selectedTier.duration}* at $${selectedTier.price.toFixed(2)}. Please assist me.`;
  const whatsappUrl = `https://wa.me/${product.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  function handleAddToCart() {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      duration: selectedTier.duration,
      months: selectedTier.months ?? 0,
      price: selectedTier.price,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Left: Product Visual */}
      <div className="space-y-4">
        {/* Main image / illustration */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center shadow-lg border border-gray-100">
          <img 
            src={product.image || '/images/placeholder.png'} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {/* Category badge */}
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
            >
              <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
              <span className="text-xs font-medium text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="space-y-6">
        {/* Title & rating */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>

        {/* Price display */}
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
          <div className="text-sm text-gray-500 mb-1">Price</div>
          <div className="text-4xl font-extrabold text-violet-700">
            ${selectedTier.price.toFixed(2)}
          </div>
          {!isFlatPrice && (
            <div className="text-sm text-gray-500 mt-1">
              for {selectedTier.duration}
            </div>
          )}
        </div>

        {/* Duration selector — hidden for flat-price products */}
        {!isFlatPrice && (
        <div>
          <label
            htmlFor="duration-select"
            className="block text-sm font-bold text-gray-800 mb-2"
          >
            Select Duration
          </label>
          <div className="relative">
            <select
              id="duration-select"
              value={selectedTierIndex}
              onChange={(e) => setSelectedTierIndex(Number(e.target.value))}
              className="w-full appearance-none bg-white border-2 border-gray-200 focus:border-violet-500 text-gray-800 font-semibold px-4 py-3 pr-10 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
            >
              {product.priceTiers.map((tier, index) => (
                <option key={tier.duration} value={index}>
                  {tier.duration} — ${tier.price.toFixed(2)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Plan pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {product.priceTiers.map((tier, index) => (
              <button
                key={tier.duration}
                onClick={() => setSelectedTierIndex(index)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-all duration-200 ${
                  index === selectedTierIndex
                    ? 'border-violet-600 bg-violet-600 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-violet-300'
                }`}
              >
                {tier.duration}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* What's included */}
        <div className="space-y-2">
          {[
            'Instant delivery via email',
            '10,000+ live channels included',
            'Full HD & 4K streams available',
            'Compatible with all devices',
            'No contract, cancel anytime',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="add-to-cart-btn"
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all duration-200 text-sm ${
              addedToCart
                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-xl hover:shadow-violet-200 active:scale-95'
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>

          <a
            id="whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-green-200 active:scale-95 text-sm"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp Us
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-green-500" />
            Secure Payment
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Zap className="w-4 h-4 text-yellow-500" />
            Instant Activation
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Headphones className="w-4 h-4 text-blue-500" />
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  );
}
