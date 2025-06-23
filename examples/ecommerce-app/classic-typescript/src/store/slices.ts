import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const useProductSlice = () => productSlice("productState", {});
export const useCartSlice = () => cartSlice("cartState", {});
