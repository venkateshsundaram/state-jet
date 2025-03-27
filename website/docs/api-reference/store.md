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

### ✅ Example: Creating store for Ecommerce App

```tsx 
import { useStore, useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

const useProductSlice = () => productSlice("list", []);
const useCartSlice = () => cartSlice("list", []);

const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice()
});

export const useEcommerceStore = () =>  useStore(initializer);
```

Check out this **[tutorial](/docs/tutorial/ecommerce-app#create-store)** for a complete example of `useStore` in action.