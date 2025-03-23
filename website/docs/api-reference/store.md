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

### ✅ Example: Creating store for Ecommerce App

**🔹 Step 1: Setup store (`src/store/productStore.ts`):**

```ts title="src/store/productStore.ts"
import { useStore, useSlice } from "state-jet";

type Product = {
  id: number;
  name: string;
};

const useSearchSlice = useSlice("searches");
const useFavouriteSlice = useSlice("favourites");
const useSharedSlice = useSlice("shared");

export const store = useStore()((set) => ({
  searches: useSearchSlice<Product[]>("search-products", [{
    id: "1",
    name: "books"
  }, {
    id: "2",
    name: "cars"
  }]),
  favourites: useFavouriteSlice<Product[]>("favourite-products", [{
    id: "1",
    name: "books"
  }])
  shared: useSharedSlice<string>("theme", "light")
}));

```

**🔹 Step 2: Setup search slice (`src/components/search.tsx`):**

```tsx title="src/components/search.tsx"
import { store } from "../store/productStore.ts";

export default function Search() {
  const searches = store.searches;

  return (
    <div>
      <h1>Search count: {searches.get().length}</h1>
      <button onClick={() => searches.set({
        id: 3,
        name: "electronics"
      })}>Add search</button>
    </div>
  );
}
```

**🔹 Step 3: Setup favourite slice (`src/components/favourite.tsx`):**

```tsx title="src/components/favourite.tsx"
import { store } from "../store/productStore.ts";

export default function Favourite() {
  const favourites = store.favourites;

  return (
    <div>
      <h1>Favorite count: {favourites.get().length}</h1>
      <button onClick={() => favourites.set({
        id: 3,
        name: "electronics"
      })}>Add Favourite</button>
    </div>
  );
}
```

**🔹 Step 4: Setup shared slice (`src/components/shared.tsx`):**

```tsx title="src/components/shared.tsx"
import { store } from "../store/productStore.ts";

export default function ThemeToggle() {
  const shared = store.shared;

  return (
    <div>
      <h2>Theme</h2>
      <p>Current Theme: {theme}</p>
      <button onClick={() => shared.set(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
}
```