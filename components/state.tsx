import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  items: any[];
  // addItem: (item: Omit<any, "quantity">, qty: number) => void;
  addItem: (item: any, qty: number) => void;
  incrementQuantity: (_id: string) => void;
  decrementQuantity: (_id: string) => void;
  deleteItem: (_id: string) => void;
  searchValue: string;
  setSearchValue: (text: string) => void;
}

const useStore = create<StoreState>((set) => ({
  items: [],

  addItem: (newItem, qty) =>
    set((state) => {
      const existingItem = state.items.some(
        (item) => item["_id"] === newItem["_id"]
      );
      console.log("newItem: ", newItem["_id"]);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item._id === newItem._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return { items: [...state.items, { ...newItem, quantity: qty || 1 }] };
      }
    }),

  incrementQuantity: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item["_id"] === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decrementQuantity: (id) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item["_id"] === id && item.quantity > 0
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item["_id"] !== id),
    })),

  searchValue: "",
  setSearchValue: (value) => set({ searchValue: value }),
}));

export default useStore;
