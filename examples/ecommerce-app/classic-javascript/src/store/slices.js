import { useSlice } from "state-jet";

// 🛍️ Product Slice
export const useProductSlice = () => useSlice("products")("list", []);

// 🛒 Cart Slice
export const useCartSlice = () =>
  useSlice("cart")("items", []);

// 👤 User Slice
export const useUserSlice = () => useSlice("user")("info", null);
