import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

// Define multiple state values under one slice
export const useProductSlice = () => ({
  productState: productSlice("productState", {}),
  productFilter: productSlice("productFilter", { search: "", category: "all" }),
  productSort: productSlice("productSort", { order: "asc" }),
});

export const useCartSlice = () => cartSlice("cartState", {});
