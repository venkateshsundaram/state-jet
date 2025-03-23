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

### ✅ Example: Creating multiple slice for Ecommerce App

Create a file at `src/components/Products.tsx`:

```tsx title="src/components/Products.tsx"
import { useSlice } from "state-jet";

type Product = {
  id: number;
  name: string;
};

const useSearchSlice = useSlice("searches");
const useFavouriteSlice = useSlice("favourites");
const searches = useSearchSlice<Product[]>("search-products", [{
    id: "1",
    name: "books"
  }, {
    id: "2",
    name: "cars"
}]);
const favourites = useFavouriteSlice<Product[]>("favourite-products", [{
  id: "1",
  name: "books"
}]);

export default function Products() {

  return (
    <div>
      <h1>Search count: {searches.get().length}</h1>
      <h1>Favourite count: {favourites.get().length}</h1>
    </div>
  );
}
```