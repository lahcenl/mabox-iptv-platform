import { ShieldCheck } from 'lucide-react';

const TICKER_TEXT = '🚀 Instant Delivery via WhatsApp | 💎 Premium Anti-Buffer Servers | 🛠️ 24/7 Technical Support';

export default function TrendingTicker() {
  // Duplicate the text to ensure the scrolling is continuous and fills the width
  const items = Array(8).fill(TICKER_TEXT);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-violet-950 to-gray-900 border-t border-violet-900/40 overflow-hidden">
      <div className="flex items-center">
        {/* Fixed label */}
        <div className="flex items-center gap-2 px-4 py-3 bg-violet-700 flex-shrink-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.4)]">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
            Ondexy Promise ⭐
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="ticker-wrapper py-2.5">
            <div className="flex items-center gap-0 ticker-track">
              {items.map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 px-6 flex-shrink-0"
                >
                  <span className="text-sm font-semibold text-white/95 whitespace-nowrap">
                    {text}
                  </span>
                  {/* Divider dot */}
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400/40 flex-shrink-0 ml-4" />
                </div>
              ))}
            </div>
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
          animation: ticker-scroll 35s linear infinite;
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
