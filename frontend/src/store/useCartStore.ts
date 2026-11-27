'use client';

import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'subtotal'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        const newQty = existing.quantity + item.quantity;
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: newQty, subtotal: i.price * newQty }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...item, subtotal: item.price * item.quantity },
        ],
      };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity, subtotal: i.price * quantity }
          : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  totalAmount: () => {
    return get().items.reduce((acc, curr) => acc + curr.subtotal, 0);
  },
  totalItems: () => {
    return get().items.reduce((acc, curr) => acc + curr.quantity, 0);
  },
}));
