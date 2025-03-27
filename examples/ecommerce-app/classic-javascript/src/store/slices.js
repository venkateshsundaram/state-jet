import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const useProductSlice = () => productSlice("list", []);
export const useCartSlice = () => cartSlice("list", []);
