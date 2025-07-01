import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import debounce from "lodash/debounce";
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  color: string;
  size: string;
  price: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  deleteEntireCart: () => Promise<void>;
  updateCartItemQuantity: (id: string, quantity: number) => Promise<void>;
}
export const useCartStore = create<CartStore>((set, get) => {
  const debounceUpdateCartItemQuantity = debounce(
    async (id: string, quantity: number) => {
      try {
        await axios.put(
          `${API_ROUTES.CART}/update/${id}`,
          { quantity },
          { withCredentials: true }
        );
      } catch (error) {
        set({ error: "failed to update cart quantity" });
      }
    }
  );
  return {
    isLoading: false,
    error: null,
    items: [],
    fetchCart: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_ROUTES.CART}/fetch-cart`, {
          withCredentials: true,
        });
        set({ isLoading: false, items: response.data.data });
      } catch (error) {
        set({ isLoading: false, error: "Error Fetching" });
      }
    },
    addToCart: async (item) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_ROUTES.CART}/add-to-cart`,
          item,
          { withCredentials: true }
        );
        set((state) => ({
          items: [...state.items, response.data.data],
          isLoading: false,
        }));
      } catch (error) {
        set({ isLoading: false, error: "Error Adding to the cart" });
      }
    },
    removeFromCart: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_ROUTES.CART}/remove/${id}`, {
          withCredentials: true,
        });
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({ isLoading: false, error: "Unable to remove from cart" });
      }
    },
    updateCartItemQuantity: async (id, quantity) => {
      set((state) => ({
        items: state.items.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity } : cartItem
        ),
      }));
      debounceUpdateCartItemQuantity(id, quantity);
    },
    deleteEntireCart: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_ROUTES.CART}/clear-cart`, {
          withCredentials: true,
        });
        set({ items: [], isLoading: false });
      } catch (error) {
        set({ isLoading: false, error: "Unable to delete entirecart" });
      }
    },
  };
});
