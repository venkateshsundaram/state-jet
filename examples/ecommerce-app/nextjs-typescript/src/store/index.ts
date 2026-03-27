"use client";

import { useStore } from "state-jet";
import { getProductSlice, getCartSlice } from "./slices";

const initializer = () => ({
  products: getProductSlice(),
  cart: getCartSlice(),
});

export const useEcommerceStore = () => useStore(initializer);

export type EcommerceStore = ReturnType<typeof initializer>;
