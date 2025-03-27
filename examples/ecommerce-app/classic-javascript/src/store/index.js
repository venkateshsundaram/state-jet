import { useStore } from "state-jet";
import { useProductSlice, useCartSlice } from "./slices";

const initializer = () => ({
  products: useProductSlice(),
  cart: useCartSlice()
});

export const useEcommerceStore = () =>  useStore(initializer)