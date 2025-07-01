import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean | null>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<Boolean>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      error: null,
      isLoading: false,
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/register", {
            name,
            email,
            password,
          });
          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data.error
              : "Registration Failed",
          });
          return null;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
          });
          set({ isLoading: false, user: response.data.user });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data.error
              : "Login Failed",
          });
          return null;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/logout");
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error(error);
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data.error
              : "Logout Failed",
          });
        }
      },
      refreshAccessToken: async () => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/refresh-token");
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    }),
    { name: "auth-sorage", partialize: (state) => ({ user: state.user }) }
  )
);
