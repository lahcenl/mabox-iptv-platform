import fs from 'fs';
import path from 'path';
import { TrendingUp, Tv } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  priceTiers: { price: number }[];
}

function loadFeaturedProducts(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const all: Product[] = JSON.parse(raw);
    // Pick up to 6 products for the ticker
    return all.slice(0, 6);
  } catch {
    return [];
  }
}

function TickerTrack({ products }: { products: Product[] }) {
  // Duplicate the list so the loop appears seamless
  const items = [...products, ...products];

  return (
    <div className="flex items-center gap-0 ticker-track">
      {items.map((product, idx) => (
        <div
          key={`${product.id}-${idx}`}
          className="flex items-center gap-2.5 px-5 flex-shrink-0"
        >
          {/* Icon / thumbnail */}
          {product.image && !product.image.startsWith('/images/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="w-7 h-7 rounded-md object-cover bg-white/10 flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
              <Tv className="w-3.5 h-3.5 text-violet-300" />
            </div>
          )}

          <span className="text-sm font-medium text-white/90 whitespace-nowrap">
            {product.name}
          </span>

          {product.priceTiers?.[0]?.price !== undefined && (
            <span className="text-xs font-bold text-violet-300 whitespace-nowrap">
              from ${product.priceTiers[0].price}
            </span>
          )}

          {/* Divider dot */}
          <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0 ml-3" />
        </div>
      ))}
    </div>
  );
}

export default function TrendingTicker() {
  const products = loadFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 via-violet-950 to-gray-900 border-t border-violet-900/40 overflow-hidden">
      <div className="flex items-center">
        {/* Fixed label */}
        <div className="flex items-center gap-2 px-4 py-3 bg-violet-700 flex-shrink-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.4)]">
          <TrendingUp className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
            Trending now 📈
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="ticker-wrapper py-2.5">
            <TickerTrack products={products} />
          </div>
        </div>
      </div>

      {/* Animation styles — injected as a style tag */}
      <style>{`
        .ticker-wrapper {
          display: flex;
          width: max-content;
        }
        .ticker-track {
          animation: ticker-scroll 28s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
