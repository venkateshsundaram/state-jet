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

Setup Slices file (`src/store/slices.ts`):

```ts title="src/store/slices.ts"
import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const useProductSlice = () => productSlice("list", []);
export const useCartSlice = () => cartSlice("list", []);
```

Setup Store file (`src/store/index.ts`):

```ts title="src/store/index.ts"
import { useStore } from "state-jet";
import { useProductSlice, useCartSlice } from "./slices";

/**
 * Ecommerce store with product and cart slices
 */
const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice()
});

export const useEcommerceStore = () =>  useStore(initializer);
```

Check out this **[tutorial](/docs/tutorial/ecommerce-app#create-store)** for a complete example of `useStore` in action.