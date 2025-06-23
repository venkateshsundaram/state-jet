[![npm](https://img.shields.io/npm/v/state-jet.svg)](https://www.npmjs.com/package/state-jet)
[![npm](https://img.shields.io/npm/dt/state-jet.svg)](https://npm-stat.com/charts.html?package=state-jet)
[![GitHub issues](https://img.shields.io/github/issues/venkateshsundaram/state-jet.svg)](https://github.com/venkateshsundaram/state-jet/issues)

A zero-boilerplate, ultra-fast global state management library for React.

For more details, see [here](https://statejet.netlify.app).

## Table of Contents

  - [🚀 Why state-jet?](#why-state-jet?)
  - [Documentation](#documentation)
  - [🛠 Installation](#installation)
  - [GlobalState](#globalstate)
    - [Create GlobalState](#create-globalstate)
    - [Binding Global State to a Component](#binding-global-state-to-a-component)
  - [Slices](#slices)
    - [Create Slice](#create-slice)
  - [Store](#store)
    - [Create Store](#create-store)
    - [Binding Store to a Component](#binding-store-to-a-component)
  - [Middlewares](#middlewares)
    - [Logger Middleware](#logger-middleware)
    - [Reducer Middleware](#reducer-middleware)
    - [Debounce Middleware](#debounce-middleware)
    - [Optimistic Middleware](#optimistic-middleware)
    - [Custom Middleware](#custom-middleware)
  - [Typescript Usage](#typescript-usage)
  - [Why state-jet Is More Advanced Than Zustand](#why-state-jet-is-more-advanced-than-zustand)
  - [FAQ](#faq)
  - [Conclusion](#conclusion)
  - [⚡ Comparison Table](#comparison-table)
  - [Comparison with other libraries](#comparison-with-other-libraries)
  - [Contributing](#contributing)
  - [Publishing](#publishing)
  - [Feedbacks and Issues](#feedbacks-and-issues)
  - [License](#license)

## 🚀 Why state-jet?

- ✅ **No Context, No Providers** – Works outside React, reducing unnecessary re-renders.
- ✅ **Automatic Re-Renders** – Only components using specific state values update.
- ✅ **Super Lightweight** – Ultra small!
- ✅ **SSR & Next.js Support** – Works on both client and server.

## Documentation

Documentation: https://statejet.netlify.app/docs

Tutorials: https://statejet.netlify.app/docs/tutorial/intro/

API Reference: https://statejet.netlify.app/docs/api-reference/global-state/

Wiki: https://deepwiki.com/venkateshsundaram/state-jet

## 🛠 Installation

The Statejet package lives in npm. Please see the [installation guide](https://statejet.netlify.app/docs/getting-started/installation-and-setup/).

To install the latest stable version, run the following command:

```bash
npm install state-jet
```

Or if you're using `yarn`:

```bash
yarn add state-jet
```

Or if you're using `cdn`:

```bash
<script src="https://cdn.jsdelivr.net/npm/state-jet@latest/dist/index.cjs"></script>
```

## GlobalState

The `useStateGlobal` hook is the simplest entry point to State-Jet—-ideal for simple applications with minimal state management needs. It allows you to create stateful values that can be accessed and updated from any component in your application, regardless of their location in the component tree.

### Create GlobalState

```ts
// file: src/store/index.ts

import { useStateGlobal } from "state-jet";

export const counterState = useStateGlobal("counter", 0);
```

### Binding Global State to a Component

```tsx
// file: src/components/Counter.tsx

import { counterState } from "../store";

export default function Counter() {
  const count = counterState.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counterState.set(count - 1)}>Decrement</button>
      <button onClick={() => counterState.set(count + 1)}>Increment</button>
    </div>
  );
}
```

## Slices

Slices in state-jet represent logical groupings of state that help organize application data into manageable pieces. Unlike the global state approach which uses a single namespace, slices allow for partitioning state into named segments, making state management more modular and maintainable.

### Create Slice

```ts
// file: src/store/slices.ts

import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");

export const useProductSlice = () => productSlice("productState", {});
export const useCartSlice = () => cartSlice("cartState", {});
```

## Store

The `useStore` hook serves as a mechanism to group related slices of state into a cohesive store, enabling modular and organized state management in React applications which are better suited for larger applications with more complex and structured state requirements.

### Create Store

```ts
// file: src/store/index.ts

import { useStore } from "state-jet";
import { useProductSlice, useCartSlice } from "./slices";

/**
 * Ecommerce store with product and cart slices
 */
const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice(),
});

export const useEcommerceStore = () =>  useStore(initializer);
```

### Binding Store to a Component

```tsx
// file: src/components/ProductList.tsx

import { useEcommerceStore } from "../store";

type ProductType = {
  name: string,
  price: number
}
  
type CartType = {
  name: string,
  price: number,
  count: number
}

export const ProductList = () => {
  const store = useEcommerceStore();
  const products: any = store.products;
  const cart: any = store.cart;
  const productSliceData: any = products.useState();
  const cartSliceData: any = cart.useState();
  const productItems: Array<ProductType> = productSliceData?.items || [];
  const cartItems: Array<CartType> = cartSliceData?.items || [];

  const addToCart = (product: ProductType) => {
    if (cartItems.some((cartItem: CartType) => cartItem.name === product.name)) {
      cart.set((cartVal: any)=> ({
        ...cartVal,
        items: cartItems.map((cartItem: CartType) => {
          if (cartItem.name === product.name) {
            return { ...cartItem, count: (cartItem.count || 0) + 1 };
          }
          return cartItem;
        })
      }));
    } else {
      cart.set((cartVal: any)=> ({
        ...cartVal,
        items: [...cartItems, { ...product, count: 1 }]
      }));
    }
  };

  return (
    <div>
      <h2>🛍️ Products</h2>
      <ul>
        {productItems && productItems.map((productItem: ProductType, index: number) => (
          <li key={index}>
            {productItem.name} - ${productItem.price}{" "}
            <button onClick={() => addToCart(productItem)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

```

## Middlewares

Middleware in state-jet is a powerful mechanism for intercepting, transforming, and processing state updates before they are applied to the store.

Unlike other libraries, you do not need to rely on any external dependencies. A `middleware` property from `options` helps to add middleware for state-jet.

```bash
function useStateGlobal<T>(
  ...
  options?: { middleware?: [] }
) 
```

### Logger Middleware

You can log your store for every action.

```ts
// file: src/store/middleware.ts

export const loggerMiddleware = (key: string, prev: number, next: number) => {
  console.log(`[state-jet] ${key}: ${prev} → ${next}`);
};

```

Create global state with loggerMiddleware

```ts
// file: src/store/index.ts

import { useStateGlobal } from "state-jet";
import { loggerMiddleware } from "./middleware";
 
export const counterState = useStateGlobal("counter", 0, { middleware: [loggerMiddleware] });

```

Binding Global State to a Component

```tsx
// file: src/components/Counter.tsx

import { counterState } from "../store";

export default function Counter() {
  const count = counterState.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counterState.set(count - 1)}>Decrement</button>
      <button onClick={() => counterState.set(count + 1)}>Increment</button>
    </div>
  );
}
```

### Reducer Middleware

Can't live without reducer? No worries, StateJet supports reducer middleware.

```ts
// file: src/store/middleware.ts

type Action<T> = { type: string; payload?: T };
type Middleware<T> = (
  key: string,
  prev: T,
  next: T | Action<T> | any,
  set?: (value: T) => void,
) => T | void | Promise<void>;

export const reducerMiddleware: Middleware<number> = (key, prev, action: Action<any>) => {
  switch (action.type) {
    case "INCREMENT":
      return prev + 1;
    case "DECREMENT":
      return prev - 1;
    case "RESET":
      return 0;
    default:
      return prev;
  }
}
```

Create global state with reducerMiddleware

```ts
// file: src/store/index.ts

import { useStateGlobal } from "state-jet";
import { reducerMiddleware } from "./middleware";
 
export const counterState = useStateGlobal("counter", 0, { middleware: [reducerMiddleware] });

```

Binding Global State to a Component

```tsx
// file: src/components/Counter.tsx

import { counterState } from "../store";

export default function Counter() {
  const count = counterState.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counterState.set({ type: "DECREMENT" })}>Decrement</button>
      <button onClick={() => counterState.set({ type: "INCREMENT" })}>Increment</button>
      <button onClick={() => counterState.set({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

### Debounce Middleware

You can delay the update of global state.

```ts
// file: src/store/middleware.ts

let timer: ReturnType<typeof setTimeout>;

// Debounce middleware with delay
export const debounceMiddleware = (delay: number) => {
    return (key: string, prev: number, next: any, set?: (value: any) => void) => {
        clearTimeout(timer);
        if (set) {
          timer = setTimeout(() => {
            console.log(`[state-jet] Debounced: ${key} → ${next}`);
            set(next); // Apply the debounced update
          }, delay);
        }
    };
};
```

Create global state with debounceMiddleware

```ts
// file: src/store/index.ts

import { useStateGlobal } from "state-jet";
import { debounceMiddleware } from "./middleware";
 
export const counterState = useStateGlobal("counter", 0, { middleware: [debounceMiddleware(500)] });
```

### Optimistic Middleware

You can optimistically update global state with rollback support.

```ts
// file: src/store/middleware.ts

export const optimisticMiddleware = (apiUrl: string) => {
  return async (key: string, prev: number, next: number, set: any) => {
    set(next); // Optimistically update state

    try {
      await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({ key, value: next }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.warn(`[state-jet] Rollback: Failed to sync ${key}`);
      set(prev); // Rollback state on failure
    }
  };
};
```

Create global state with optimisticMiddleware

```ts
// file: src/store/index.ts

import { useStateGlobal } from "state-jet";
import { optimisticMiddleware } from "./middleware";
 
export const profileState = useStateGlobal("profile", { name: "John" }, { 
  middleware: [optimisticMiddleware("/update-profile")],
});
```

### Custom Middleware

You can also create your own custom middleware in state-jet.

```ts
// file: src/store/middleware.ts

export const validateAgeMiddleware = (key: string, prev: number, next: number) => {
  if (next < 0) {
    console.warn("Age cannot be negative!");
    return prev;
  }
  return next;
};
```

Create global state with validateAgeMiddleware

```ts
// file: src/store/index.ts

import { useStateGlobal } from "state-jet";
import { validateAgeMiddleware } from "./middleware";
 
export const ageState = useStateGlobal("age", 0, { middleware: [validateAgeMiddleware] });

```

Binding Global State to a Component

```tsx
// file: src/components/Profile.tsx

import { ageState } from "../store";

export default function Profile() {
  const age = ageState.useState() as number;

  return (
    <div>
      <h1>Age: {age}</h1>
      <button 
        onClick={() => {
          ageState.set(-5) // Age will be 0 eventhough it updated with negative value due to middleware logic
        }}>
          Set negative
      </button> 
    </div>
  );
}
```

A more complete middleware usage is [here](https://statejet.netlify.app/docs/api-reference/middlewares/).

## Typescript Usage

Here is the example for creating global state with typescript definition.

```tsx
interface Todo = {
  id: number;
  text: string;
  completed: boolean
};

const todoState = useStateGlobal<Todo[]>("todos", []);
```

## Why state-jet Is More Advanced Than Zustand

- **No Proxies Needed**: Zustand uses proxies for state updates, but state-jet uses signals, making it even faster.
- **Derived State Is Automatic**: No need for selectors; state updates only trigger where necessary.
- **Optimistic Updates & Rollback**: Unlike Zustand, state-jet has built-in support for instant UI updates and auto-revert on failures.
- **Multi-Tab Sync**: Global state persists across browser tabs and devices.
- **CRDT Support**: Automatic conflict resolution for real-time apps, something even Zustand lacks.

## FAQ
- If you want to manage your global state like `useState` as usual.
- If you want to manage your global state without involving in setting up Provider Component, Dispatcher, Reducer, etc.
- If you want to see `Redux` or `Context API` alternative.

## Conclusion

If you need the simplest, fastest, and most advanced state management solution for React, state-jet beats Redux, Recoil, MobX, Jotai, and even Zustand in performance, reactivity, and developer experience. 🚀


## ⚡ Comparison Table
| Feature                  | Redux  | Recoil | MobX  | Jotai  | Zustand                | state-jet            |
|--------------------------|--------|--------|-------|--------|------------------------|----------------------|
| **Easy Setup**           | ❌ No  | ❌ No  | ⚠️ No | ❌ No  | ⚠️ Minimal            | ✅ Ultra-Minimal    |
| **Bundle Size**          | 🚀 Large | 🚀 Medium | ⚡ Small | ⚡ Small | ⚡ Small | 🔥 Ultra-Small  |
| **Reactivity**           | ⚠️ Reducers | ✅ Atoms | ✅ Proxy-Based | ✅ Signals | ✅ Proxy-Based | ✅ Signal-Like |
| **Renders Only Affected** | ❌ No  | ✅ Yes  | ✅ Yes  | ✅ Yes  | ✅ Yes                | ✅ Yes              |
| **Derived/Computed State** | ❌ No  | ✅ Yes  | ✅ Yes  | ✅ Yes  | ⚠️ Manual Selectors  | ✅ Yes (Automatic) |
| **Optimistic Updates**    | ❌ No  | ❌ No  | ❌ No  | ❌ No  | ⚠️ Requires Middleware | ✅ Built-in        |
| **Undo/Redo**            | ❌ No  | ❌ No  | ❌ No  | ❌ No  | ⚠️ Requires Middleware | ✅ Built-in        |
| **CRDT Conflict Resolution** | ❌ No  | ❌ No  | ❌ No  | ❌ No  | ❌ No                 | ✅ Yes              |

## Comparison with other libraries

- [Difference between state-jet and other state management libraries for React](https://npm-stat.com/charts.html?package=state-jet&package=zustand&package=%40reduxjs%2Ftoolkit&package=recoil)

## Contributing

Development of State-jet happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving State-jet.

- [Contributing Guide](./CONTRIBUTING.md)

## Publishing
Before pushing your changes to Github, make sure that `version` in `package.json` is changed to newest version. Then run `npm install` for synchronize it to `package-lock.json` and `pnpm install` for synchronize it to `pnpm-lock.yaml`

## Feedbacks and Issues
Feel free to open issues if you found any feedback or issues on `state-jet`. And feel free if you want to contribute too! 😄

## License

State-jet is [MIT licensed](./LICENSE).
