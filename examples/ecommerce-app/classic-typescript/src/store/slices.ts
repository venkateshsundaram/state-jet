import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");
const userSlice =  useSlice("user");

export const useProductSlice = () => productSlice("list", []);
export const useCartSlice = () => cartSlice("items", []);
export const useUserSlice = () => userSlice("info", null);
