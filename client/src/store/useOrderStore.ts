import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  price: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  userId: string;
  addressId: string;
  couponId?: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  total: number;
  paymentMethod: "CREDIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}
interface CreateOrderData {
  userId: string;
  addressId: string;
  items: Omit<OrderItem, "id">[];
  couponId?: string;
  total: number;
  paymentMethod: "CREDIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
}

export interface AdminOrder extends Order {
  user: {
    id: string;
    name: string;
    email: string;
  };
}
interface OrderStore {
  error: string | null;
  isLoading: boolean;
  currentOrder: Order | null;
  isPaymentProcessing: boolean;
  userOrders: Order[];
  adminOrders: AdminOrder[];
  createPaypalOrder: (items: any[], total: number) => Promise<string | null>;
  capturePaypalOrder: (id: string) => Promise<any | null>;
  createFinalOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  getOrder: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<boolean>;
  getAllOrders: () => Promise<Order[] | null>;
  getOrdersbyUserId: () => Promise<Order[] | null>;
  setCurrentOrder: (order: Order | null) => void;
}
export const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: false,
  error: null,
  currentOrder: null,
  isPaymentProcessing: false,
  userOrders: [],
  adminOrders: [],
  createPaypalOrder: async (items, total) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/create-paypal-order`,
        { items, total },
        { withCredentials: true }
      );
      set({ isLoading: false });
      return response.data.id;
    } catch (error) {
      set({ isLoading: false, error: "Failed to create paypal order" });
      return null;
    }
  },
  capturePaypalOrder: async (orderId) => {
    set({ isLoading: true, error: null, isPaymentProcessing: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/capture-paypal-order`,
        { orderId },
        { withCredentials: true }
      );
      set({ isLoading: false, isPaymentProcessing: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "Failed to capture paypal order" });
      return null;
    }
  },
  createFinalOrder: async (orderData) => {
    set({ isLoading: true, error: null, isPaymentProcessing: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/create-final-order`,
        orderData,
        { withCredentials: true }
      );
      set({
        isLoading: false,
        isPaymentProcessing: false,
        currentOrder: response.data,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      let errorMessage = "Unable to create final order";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      set({
        isLoading: false,
        isPaymentProcessing: false,
        error: `Unable Message: ${errorMessage} `,
      });
      return null;
    }
  },
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: false, error: null });
    try {
      await axios.put(
        `${API_ROUTES.ORDER}/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      set((state) => ({
        currentOrder:
          state.currentOrder && state.currentOrder.id === orderId
            ? {
                ...state.currentOrder,
                status,
              }
            : state.currentOrder,
      }));
      return true;
    } catch (error) {
      set({ isLoading: false, error: "Unable to update the order" });
      return false;
    }
  },
  getAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-all-orders-for-admin`,
        { withCredentials: true }
      );
      set({ isLoading: false, adminOrders: response.data });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "Unable to update the order" });
      return null;
    }
  },
  getOrdersbyUserId: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-order-by-user-id`,
        { withCredentials: true }
      );
      set({ isLoading: false, userOrders: response.data });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "Unable to get you orders" });
      return null;
    }
  },
  setCurrentOrder: (order) => set({ currentOrder: order }),
  getOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-single-order/${orderId}`,
        { withCredentials: true }
      );
      set({ isLoading: false, currentOrder: response.data });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "unable to get order" });
      return null;
    }
  },
}));
