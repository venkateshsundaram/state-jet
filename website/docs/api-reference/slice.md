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

Refer this **[tutorial](/docs/tutorial/ecommerce-app#create-slices)** for `useSlice` usage