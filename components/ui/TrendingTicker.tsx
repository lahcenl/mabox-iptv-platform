import { ShieldCheck } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/i18n';

export default async function TrendingTicker({ locale }: { locale: string }) {
  const dictionary = await getDictionary(locale as Locale);
  
  const t = (key: string): string => {
    try {
      const parts = key.split('.');
      let result: any = dictionary;
      for (const part of parts) {
        result = result[part];
      }
      return typeof result === 'string' ? result : key;
    } catch {
      return key;
    }
  };

  const tickerText = `${t('ticker.delivery')} | ${t('ticker.servers')} | ${t('ticker.support')} | ${t('ticker.players')}`;
  const items = Array(8).fill(tickerText);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-violet-950 to-gray-900 border-t border-violet-900/40 overflow-hidden">
      <div className="flex items-center">
        {/* Fixed label */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 md:px-4 md:py-3 bg-violet-700 flex-shrink-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.4)]">
          <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
            {t('ticker.promise')}
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
                  className="flex items-center gap-6 px-10 md:px-6 flex-shrink-0"
                >
                  <span className="text-[11px] md:text-sm font-semibold text-white/95 whitespace-nowrap">
                    {text}
                  </span>
                  {/* Divider dot */}
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400/40 flex-shrink-0 ml-6 md:ml-4" />
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
