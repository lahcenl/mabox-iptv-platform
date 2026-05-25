'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Tv, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import CartDrawer from '@/components/ui/CartDrawer';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Products', href: '/products' },
  {
    label: 'IPTV Subscriptions',
    href: '/products?category=iptv-subscriptions',
  },
  { label: 'BEIN SPORTS', href: '/products?category=bein-sports' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, subtotal, toggleCart } = useCartStore();
  const count = itemCount();
  const total = subtotal();

  const promoMessages = [
    "🎁 كنقصو ليكم على شراء تاني شراء أو الشراء المتكرر!",
    "🔥 إبو بلاير هدية لسنة الأولى منين كيشريو سنة من الإشتراك!"
  ];
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        {/* Top bar */}
        <div className="bg-violet-700 text-white text-xs text-center py-2 px-4 font-bold tracking-wide transition-opacity duration-500 overflow-hidden h-8 flex items-center justify-center">
          <div key={promoIndex} className="animate-fade-in-up">
            {promoMessages[promoIndex]}
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-violet-700 transition-colors">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-extrabold text-gray-900 leading-none">
                  IPTV
                </span>
                <span className="text-xl font-extrabold text-violet-600 leading-none">
                  Store
                </span>
                <div className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                  Premium Streaming
                </div>
              </div>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-xl relative hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="header-search"
                  type="text"
                  placeholder="Search subscriptions, players, reseller plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link pb-1">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Cart button */}
            <button
              id="cart-toggle-btn"
              onClick={toggleCart}
              className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-semibold px-3 py-2 rounded-xl transition-all duration-200 flex-shrink-0 relative group"
              aria-label="Toggle cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-sm hidden sm:block">
                ${total.toFixed(2)}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              className="lg:hidden text-gray-600 hover:text-violet-600 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 px-4 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cart Drawer rendered at header level */}
      <CartDrawer />
    </>
  );
}
