'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, Tv, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import CartDrawer from '@/components/ui/CartDrawer';
import { useTranslations } from '@/components/providers/I18nProvider';
import { locales } from '@/lib/i18n';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const { itemCount, subtotal, toggleCart } = useCartStore();
  const { t, locale, localize } = useTranslations();

  const navLinks = [
    { label: t('header.nav.home'), href: '/' },
    { label: t('header.nav.allProducts'), href: '/products' },
    { label: t('header.nav.iptv'), href: '/products?category=iptv-subscriptions' },
    { label: t('header.nav.bein'), href: '/products?category=bein-sports' },
    { label: t('header.nav.blog'), href: '/blog' },
  ];

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/');
    let base = pathname;
    if (segments[1] === 'ar' || segments[1] === 'fr') {
      base = '/' + segments.slice(2).join('/');
    }
    const prefix = newLocale === 'en' ? '' : `/${newLocale}`;
    const newPath = `${prefix}${base}`.replace(/\/$/, '') || '/';
    const search = window.location.search;
    router.push(`${newPath}${search}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(localize(`/products?search=${encodeURIComponent(searchQuery.trim())}`));
    } else {
      router.push(localize('/products'));
    }
  };
  const count = itemCount();
  const total = subtotal();

  const promoMessages = [
    t('header.promos.0'),
    t('header.promos.1'),
    t('header.promos.2'),
  ];
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 5000);
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
            <Link href={localize('/')} className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-violet-700 transition-colors">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-gray-900 leading-none">
                  Ondexy
                </span>
                <span className="text-xl font-extrabold text-violet-600 leading-none">
                  .com
                </span>
                <div className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                  Premium Streaming
                </div>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="header-search"
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Right side controls grouped together */}
            <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
              {/* Right nav */}
              <nav className="hidden lg:flex items-center gap-6 mr-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={localize(link.href)} className="nav-link pb-1">
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Cart button */}
              <button
                id="cart-toggle-btn"
                onClick={toggleCart}
                className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-semibold px-3 py-2 rounded-xl transition-all duration-200 relative group cursor-pointer"
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

              {/* Language Switcher */}
              <div className="relative z-50">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-extrabold px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer"
                  aria-label="Select language"
                >
                  <span className="text-sm">
                    {locale === 'en' ? '🇬🇧' : locale === 'fr' ? '🇫🇷' : '🇲🇦'}
                  </span>
                  <span className="uppercase tracking-wider">{locale}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-violet-500/70" />
                </button>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setLangOpen(false);
                            handleLocaleChange(loc);
                          }}
                          className={`w-full text-left rtl:text-right px-4 py-2.5 text-xs font-bold hover:bg-violet-50 hover:text-violet-600 transition-colors uppercase cursor-pointer flex items-center gap-2 ${
                            loc === locale ? 'text-violet-600 bg-violet-50/50' : 'text-gray-700'
                          }`}
                        >
                          <span>
                            {loc === 'en' ? '🇬🇧' : loc === 'fr' ? '🇫🇷' : '🇲🇦'}
                          </span>
                          <span>
                            {loc === 'en' ? 'EN' : loc === 'fr' ? 'FR' : 'AR'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                id="mobile-menu-toggle"
                className="lg:hidden text-gray-600 hover:text-violet-600 transition-colors cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('header.searchPlaceholderMobile')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Mobile nav menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3 shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={localize(link.href)}
                  className="block py-2.5 px-4 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Inline Language selector inside mobile menu */}
            <div className="pt-4 border-t border-gray-100 px-4">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Language / Langue / اللغة
              </div>
              <div className="flex gap-2">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setMobileOpen(false);
                      handleLocaleChange(loc);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      loc === locale
                        ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{loc === 'en' ? '🇬🇧' : loc === 'fr' ? '🇫🇷' : '🇲🇦'}</span>
                    <span className="uppercase">{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer rendered at header level */}
      <CartDrawer />
    </>
  );
}
