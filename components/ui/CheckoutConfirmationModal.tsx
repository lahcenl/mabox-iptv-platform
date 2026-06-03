'use client';

import { X, MessageCircle, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from '@/components/context/LanguageContext';

interface CheckoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: any[];
  total: number;
  isProcessing: boolean;
}

export default function CheckoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  total,
  isProcessing,
}: CheckoutConfirmationModalProps) {
  const { t } = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('checkoutModal.title') || 'Confirm Your Order'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Informational Warning */}
          <div className="flex gap-3 bg-violet-50/60 border border-violet-100 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-gray-600">
              {t('checkoutModal.description') ||
                'You will be redirected to WhatsApp to send your order details. Our team will then provide your payment and activation details.'}
            </p>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t('checkoutModal.items') || 'Items to Order'}
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      {t('products.duration.' + item.duration) || item.duration} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {t('checkoutModal.total') || 'Total Amount'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{t('cart.includesTaxes') || 'Includes all plans & services'}</p>
            </div>
            <span className="text-2xl font-black text-violet-700">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition-all duration-200 disabled:opacity-50 text-center"
          >
            {t('checkoutModal.cancel') || 'Cancel'}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-green-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('checkoutModal.processing') || 'Processing...'}
              </>
            ) : (
              <>
                <MessageCircle className="w-4.5 h-4.5" />
                {t('checkoutModal.send') || 'Send to WhatsApp'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
