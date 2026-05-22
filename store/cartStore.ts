'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  duration: string;
  months: number;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Computed
  itemCount: () => number;
  subtotal: () => number;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      itemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (newItem) => {
        const existing = get().items.find(
          (item) => item.id === newItem.id && item.duration === newItem.duration
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === newItem.id && item.duration === newItem.duration
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...newItem, quantity: 1 }],
            isOpen: true,
          }));
        }
      },

      removeFromCart: (compositeKey) => {
        // compositeKey format: `${id}-${duration}`
        set((state) => ({
          items: state.items.filter(
            (item) => `${item.id}-${item.duration}` !== compositeKey
          ),
        }));
      },

      updateQuantity: (compositeKey, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(compositeKey);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            `${item.id}-${item.duration}` === compositeKey ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'iptv-cart-storage',
      // Only persist items (not UI state like isOpen)
      partialize: (state) => ({ items: state.items }),
    }
  )
);
