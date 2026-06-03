'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { processCheckout } from '@/lib/checkout';
import { useTranslations } from '@/components/context/LanguageContext';
import CheckoutConfirmationModal from '@/components/ui/CheckoutConfirmationModal';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, itemCount, clearCart } =
    useCartStore();
  const { t, localize, locale } = useTranslations();
  const total = subtotal();
  const count = itemCount();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCheckout = async () => {
    setIsCheckingOut(true);
    await processCheckout(items, total, clearCart);
    setIsConfirmModalOpen(false);
    setIsCheckingOut(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        id="cart-drawer"
        className={`fixed top-0 right-0 rtl:right-auto rtl:left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}
        aria-label={t('cart.title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-gray-900">{t('cart.title')}</h2>
            {count > 0 && (
              <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {count} {count === 1 ? t('cart.item') : t('cart.items')}
              </span>
            )}
          </div>
          <button
            id="cart-close-btn"
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-violet-300" />
              </div>
              <h3 className="text-gray-700 font-semibold text-lg mb-2">{t('cart.empty')}</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">
                {t('cart.emptyDesc')}
              </p>
              <Link
                href={localize('/products')}
                onClick={closeCart}
                className="btn-primary text-sm"
              >
                {t('cart.browse')}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.duration}`}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-violet-200 transition-colors"
              >
                {/* Product image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                  <img src={item.image || '/images/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                    {item.name}
                  </h4>
                  <p className="text-xs text-violet-600 font-medium mb-2">
                    {t('products.duration.' + item.duration)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(`${item.id}-${item.duration}`, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-violet-400 text-gray-600 hover:text-violet-600 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(`${item.id}-${item.duration}`, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-violet-400 text-gray-600 hover:text-violet-600 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(`${item.id}-${item.duration}`)}
                  className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 bg-gray-50 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">{t('cart.subtotal')}</span>
              <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">
              {t('cart.taxesDesc')}
            </p>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              id="checkout-btn"
              className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-violet-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('cart.processing')}
                </>
              ) : (
                <>
                  {t('cart.checkout')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>

            <Link
              href={localize('/cart')}
              onClick={closeCart}
              className="block w-full text-center text-sm text-gray-500 hover:text-violet-600 transition-colors py-1 font-semibold"
            >
              {t('cart.viewDetails')}
            </Link>
          </div>
        )}
      </aside>

      <CheckoutConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmCheckout}
        items={items}
        total={total}
        isProcessing={isCheckingOut}
      />
    </>
  );
}
