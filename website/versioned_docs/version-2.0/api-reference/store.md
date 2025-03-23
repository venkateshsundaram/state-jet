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
```jsx
export const useStore = <T extends Record<string, any>>() => {
  return <S extends (store: T) => void>(initializer: S) => {
    const combinedStore: T = {} as T;
    initializer(combinedStore);
    return combinedStore;
  };
};
```

Refer this **[tutorial](/docs/tutorial/ecommerce-app#create-store)** for `useStore` usage
