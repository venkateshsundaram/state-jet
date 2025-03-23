import { useStore } from "state-jet";
import { useProductSlice, useCartSlice, useUserSlice } from "./slices";

export const useEcommerceStore = () =>
  useStore()(() => ({
    products: useProductSlice(),
    cart: useCartSlice(),
    user: useUserSlice(),
  }));
