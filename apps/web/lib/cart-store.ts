import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  title: string;
  isbn: string;
  coverUrl: string;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => boolean; // returns true if added, false if already exists
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item: CartItem) => {
        const { items } = get();
        if (items.some((cartItem) => cartItem.id === item.id)) {
          return false;
        }
        set({ items: [...items, item] });
        return true;
      },
      removeFromCart: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      isInCart: (id: string) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
