---
sidebar_position: 2
id: slice
title: useSlice()
slug: /api-reference/slices/
description: Slice set up for State-jet
keywords:
- slices
- slice pattern
- slice
---

An `useSlice()` represents grouped state slice in State-jet.
```jsx
function useSlice<T>(
    sliceKey: string
) 
```

:::info

`useStateGlobal()` internally utilizes `useSlice()` with the reserved sliceKey `global`.

:::

- `sliceKey` - A unique string used to identify the slice.

Since `useStateGlobal()` uses slice internally, `useSlice()` also supports similar input parameters and returns the same properties as mentioned **[here](/docs/api-reference/global-state/)**

### ✅ Example: Creating slice for EcommerceApp

```tsx 
import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");
const userSlice =  useSlice("user");

export const useProductSlice = () => productSlice("list", []);
export const useCartSlice = () => cartSlice("items", []);
export const useUserSlice = () => userSlice("info", null);
```

Refer this **[tutorial](/docs/tutorial/ecommerce-app#create-slices)** for `useSlice` full example usage