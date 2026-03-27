import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const useProductSlice = () => ({
  productState: productSlice("productState", { items: [] }),
  productFilter: productSlice("productFilter", { search: "", category: "all" }),
  productSort: productSlice("productSort", { order: "asc" }),
});

export const useCartSlice = () => cartSlice("cartState", { items: [] });
