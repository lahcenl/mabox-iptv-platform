'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { processCheckout } from '@/lib/checkout';
import { useTranslations } from '@/components/context/LanguageContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  MessageCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import CheckoutConfirmationModal from '@/components/ui/CheckoutConfirmationModal';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCartStore();
  const { t, localize } = useTranslations();
  const total = subtotal();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={localize('/products')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('cart.continueShopping')}
        </Link>
        <div className="flex-1 h-px bg-gray-200" />
        <h1 className="text-2xl font-extrabold text-gray-900">{t('cart.title')}</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-violet-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-400 mb-8 max-w-xs">
            {t('cart.emptyDescFull')}
          </p>
          <Link href={localize('/products')} className="btn-primary">
            {t('cart.browse')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                {items.length} {items.length === 1 ? t('cart.item') : t('cart.items')} {t('cart.inCart')}
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
              >
                {t('cart.clearAll')}
              </button>
            </div>

            {items.map((item) => (
              <div
                key={`${item.id}-${item.duration}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex gap-5 items-start hover:border-violet-200 transition-colors"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl">
                  📡
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-0.5">{item.name}</h3>
                  <span className="inline-block text-xs text-violet-600 font-semibold bg-violet-50 px-2 py-0.5 rounded-full mb-3">
                    {t('products.duration.' + item.duration)}
                  </span>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(`${item.id}-${item.duration}`, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-violet-100 hover:text-violet-600 text-gray-600 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(`${item.id}-${item.duration}`, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-violet-100 hover:text-violet-600 text-gray-600 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-gray-900 text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(`${item.id}-${item.duration}`)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-600" />
                {t('cart.summary')}
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.id}-${item.duration}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[180px]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">{t('cart.total')}</span>
                  <span className="text-2xl font-extrabold text-violet-700">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{t('cart.includesTaxes')}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  id="cart-checkout-btn"
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-violet-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                🔒 {t('cart.secureCheckout')}
              </div>
            </div>
          </div>
        </div>
      )}

      <CheckoutConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmCheckout}
        items={items}
        total={total}
        isProcessing={isCheckingOut}
      />
    </div>
  );
}
