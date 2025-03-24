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

Refer this **[tutorial](/docs/tutorial/ecommerce-app#create-store)** for `useStore` usage
