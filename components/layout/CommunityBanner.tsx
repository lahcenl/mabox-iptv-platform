'use client';

import { Send, MessageCircle } from 'lucide-react';

export default function CommunityBanner() {
  return (
    <section className="bg-gray-100 border-t border-b border-gray-200/50 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm sm:text-base">
              Join our Telegram & WhatsApp Community
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Get instant server status updates and exclusive subscriber-only offers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="https://t.me/yourtelegram"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Telegram
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
