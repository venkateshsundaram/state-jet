---
sidebar_position: 3
id: store
title: useStore()
slug: /api-reference/store/
description: Store set up for State-jet
keywords:
- store
- combine store
- global store
---

A `useStore()` function in State-jet represents a global store, enabling the combination of slices.
```tsx
function useStore<T extends Record<string, ReturnType<typeof useSlice>>>(initializer: () => T)
```

`useStore()` returns the same properties as mentioned **[here](/docs/api-reference/global-state/)** for each slice instances.

### ✅ Example: Creating store for EcommerceApp

```tsx 
import { useStore, useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");
const userSlice =  useSlice("user");
const useProductSlice = () => productSlice("list", []);
const useCartSlice = () => cartSlice("items", []);
const useUserSlice = () => userSlice("info", null);

const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice(),
  user: useUserSlice()
});
const useEcommerceStore = () =>  useStore(initializer);
const store = useEcommerceStore();
const products = store.products;
const cart = store.cart;
const productItems = products.useState();
const cartItems = cart.useState();
```

Refer this **[tutorial](/docs/tutorial/ecommerce-app#create-store)** for `useStore` full example usage
