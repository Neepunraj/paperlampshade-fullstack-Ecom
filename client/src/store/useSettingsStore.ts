import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface FeatureBanner {
  id: string;
  imageUrl: string;
}
interface FeatureProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
}
interface SettingStore {
  isLoading: boolean;
  error: string | null;
  featureProducts: FeatureProduct[];
  banners: FeatureBanner[];
  fetchBanners: () => Promise<void>;
  addBanners: (files: File[]) => Promise<boolean>;
  updateFeaturedProduct: (productIds: string[]) => Promise<boolean>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useSettingsStore = create<SettingStore>((set, get) => ({
  isLoading: false,
  error: null,
  featureProducts: [],
  banners: [],
  fetchBanners: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await axios.get(`${API_ROUTES.SETTINGS}/get-banners`, {
        withCredentials: true,
      });
      set({ isLoading: false, banners: result.data.fetchFeatureBanner });
    } catch (error) {
      set({ isLoading: false, error: "Unable to fetch" });
    }
  },
  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await axios.get(
        `${API_ROUTES.SETTINGS}/fetch-feature-products`,
        { withCredentials: true }
      );
      set({ isLoading: false, featureProducts: result.data.featuredProducts });
    } catch (error) {
      set({ isLoading: false, error: "Error Fetching Featured Product" });
    }
  },
  addBanners: async (files: File[]) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const response = await axios.post(
        `${API_ROUTES.SETTINGS}/banners`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({ isLoading: false, error: "Unable to Add Banners" });
    }
  },
  updateFeaturedProduct: async (productIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.SETTINGS}/update-feature-products`,
        { productIds },
        { withCredentials: true }
      );
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({ isLoading: false, error: "unable to updateFeature Product" });
    }
  },
}));
