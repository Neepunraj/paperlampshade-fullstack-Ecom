"use client";

import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  rating?: number;
  soldCount: number;
  images: string[];
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  totalProducts: number;
  fetchAllProductsforAdmin: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product>;
  updateProduct: (id: string, productData: FormData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<Boolean>;
  getProductById: (id: string) => Promise<Product>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  fetchProductforClient: (params: {
    page?: number;
    limit?: number;
    categories?: string[];
    sizes?: string[];
    brands?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  setCurrentPage: (page: number) => set({ currentPage: page }),
  fetchAllProductsforAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
        { withCredentials: true }
      );
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: "Failed to Fetch Product" });
    }
  },
  createProduct: async (productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.PRODUCTS}/create-new-product`,
        productData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "unable to createProduct" });
    }
  },
  updateProduct: async (id: string, productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.PRODUCTS}/${id}`,
        productData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "Unable to Update" });
    }
  },
  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({ isLoading: false, error: "unable to delete" });
    }
  },
  getProductById: async (id: string) => {
    set({ isLoading: false, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "unable to get prodcut by id" });
    }
  },
  fetchProductforClient: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = {
        ...params,
        categories: params.categories?.join(","),
        sizes: params.sizes?.join(","),
        brands: params.brands?.join(","),
        colors: params.colors?.join(","),
      };
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-client-products`,
        {
          params: queryParams,
          withCredentials: true,
        }
      );
      set({
        isLoading: false,
        products: response.data.products,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
      });
    } catch (error) {
      console.log("error", error);
      set({ isLoading: false, error: "Error Fetching" });
    }
  },
}));
