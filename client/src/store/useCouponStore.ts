import { categories } from "./../utils/config";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Coupon {
  id: string;
  code: string;

  startDate: string;
  endDate: string;
  usageLimit: number;
  discountPercent: number;
  usageCount: number;
}

interface CouponStore {
  couponList: Coupon[];
  isLoading: boolean;
  error: string | null;
  createCoupon: (
    coupon: Omit<Coupon, "id" | "usageCount">
  ) => Promise<Coupon | null>;
  fetchAllCoupon: () => Promise<void>;
  deleteCoupon: (id: string) => Promise<boolean>;
}

export const useCouponStore = create<CouponStore>((set, get) => ({
  couponList: [],
  isLoading: false,
  error: null,
  createCoupon: async (coupon) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.COUPON}/create-coupon`,
        coupon,
        {
          withCredentials: true,
        }
      );
      set({ isLoading: false });
      return response.data.coupon;
    } catch (error) {
      set({ isLoading: false, error: "error Occured creat coupon" });
      return null;
    }
  },
  fetchAllCoupon: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.COUPON}/fetch-all-coupons`,
        {
          withCredentials: true,
        }
      );
      set({ couponList: response.data.couponList, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: "Error fetching all coupon" });
    }
  },
  deleteCoupon: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.COUPON}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({ isLoading: false, error: "Error Deleting Coupon" });
      return null;
    }
  },
}));
