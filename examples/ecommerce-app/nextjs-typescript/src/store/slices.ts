import { useSlice } from "state-jet";
import { ProductType, CartType } from "../types";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const getProductSlice = () => ({
  productState: productSlice("productState", { items: [] as ProductType[] }),
  productFilter: productSlice("productFilter", { search: "", category: "all" }),
  productSort: productSlice("productSort", { order: "asc" }),
});

export const getCartSlice = () => cartSlice("cartState", { items: [] as CartType[] });
