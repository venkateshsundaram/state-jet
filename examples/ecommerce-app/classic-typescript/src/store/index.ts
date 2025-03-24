import { useStore } from "state-jet";
import { useProductSlice, useCartSlice, useUserSlice } from "./slices";

const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice(),
  user: useUserSlice()
});

export const useEcommerceStore = () =>  useStore(initializer)