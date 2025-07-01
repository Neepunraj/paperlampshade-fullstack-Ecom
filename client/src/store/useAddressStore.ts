import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}
interface AddressStore {
  address: Address[];
  isLoading: Boolean;
  error: string | null;
  fetchAddress: () => Promise<void>;
  createAddress: (address: Omit<Address, "id">) => Promise<Address | null>;
  updateAddress: (
    id: string,
    address: Partial<Address>
  ) => Promise<Address | null>;
  deleteAddress: (id: string) => Promise<boolean>;
}
export const useAddressStore = create<AddressStore>((set, get) => ({
  isLoading: false,
  address: [],
  error: null,
  createAddress: async (address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.ADDRESS}/add-address`,
        address,
        { withCredentials: true }
      );
      const newAddress = response.data.address;
      set((state) => ({
        address: [newAddress, state.address],
        isLoading: false,
      }));
      return newAddress;
    } catch (error) {
      set({ isLoading: false, error: "unable to add new address" });
    }
  },
  fetchAddress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ADDRESS}/get-address`, {
        withCredentials: true,
      });
      set({ address: response.data.address, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: "Unable to fetch address" });
    }
  },
  updateAddress: async (id, address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.ADDRESS}/update-address/${id}`,
        address,
        {
          withCredentials: true,
        }
      );
      const updateAddress = response.data.address;
      set((state) => ({
        address: state.address.map((item) =>
          item.id === id ? updateAddress : item
        ),
        isLoading: false,
      }));
      return updateAddress;
    } catch (error) {
      set({ isLoading: false, error: "Unable to update address" });
    }
  },
  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_ROUTES.ADDRESS}/delete-address/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        isLoading: false,
        address: state.address.filter((add) => add.id !== id),
      }));
      return true;
    } catch (error) {
      set({ isLoading: false, error: "Unable tp delete address" });
      return false;
    }
  },
}));
