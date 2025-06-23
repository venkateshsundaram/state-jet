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

Since `useStateGlobal()` utilizes slices internally, `useSlice()` supports similar input parameters and returns the same properties as described **[here](/docs/api-reference/global-state/)**.

### ✅ Example: Creating slice for Ecommerce App

```tsx 
import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const useProductSlice = () => productSlice("productState", {});
export const useCartSlice = () => cartSlice("cartState", {});
```

Check out this **[tutorial](/docs/tutorial/ecommerce-app#create-slices)** for a complete example of `useSlice` in action.