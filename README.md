A zero-boilerplate, ultra-fast global state management library for React.

For more details, see [here](https://statejet.netlify.app).

## 🚀 Why state-jet?

- ✅ **No Context, No Providers** – Works outside React, reducing unnecessary re-renders.
- ✅ **Automatic Re-Renders** – Only components using specific state values update.
- ✅ **Super Lightweight** – Ultra small!
- ✅ **SSR & Next.js Support** – Works on both client and server.

## Documentation

Documentation: https://statejet.netlify.app/docs

Tutorials: https://statejet.netlify.app/docs/category/tutorial

API Reference: https://statejet.netlify.app/docs/category/api-reference

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

## Basic Example Usage

```tsx
import { useStateGlobal } from "state-jet";

const counter = useStateGlobal("counter", 0);

function Counter() {
  const count = counter.useState();
  return <button onClick={() => counter.set(count + 1)}>Count: {count}</button>;
}
```
## Why state-jet Is More Advanced Than Zustand

- **No Proxies Needed** → Zustand uses proxies for state updates, but state-jet uses signals, making it even faster.
- **Derived State Is Automatic** → No need for selectors; state updates only trigger where necessary.
- **Optimistic Updates & Rollback** → Unlike Zustand, state-jet has built-in support for instant UI updates and auto-revert on failures.
- **Multi-Tab Sync** → global state persists across browser tabs and devices.
- **CRDT Support** → Automatic conflict resolution for real-time apps, something even Zustand lacks.

### ✅ Conclusion

If you need the simplest, fastest, and most advanced state management solution for React, state-jet beats Redux, Recoil, MobX, Jotai, and even Zustand in performance, reactivity, and developer experience. 🚀

## Create Slice

```tsx
import { useSlice } from "state-jet";

const productSlice = useSlice("products");
const cartSlice = useSlice("cart");
const userSlice =  useSlice("user");

export const useProductSlice = () => productSlice("list", []);
export const useCartSlice = () => cartSlice("items", []);
export const useUserSlice = () => userSlice("info", null);
```

## Create Store

```tsx
import { useStore } from "state-jet";
import { useProductSlice, useCartSlice, useUserSlice } from "./slices";

const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice(),
  user: useUserSlice()
});

export const useEcommerceStore = () =>  useStore(initializer);
```

## Middlewares

Unlike other libraries, you do not need to rely on any external dependencies. A `middleware` property from `options` helps to add middleware for state-jet.

```bash
function useStateGlobal<T>(
    ...
    options?: { middleware?: Middleware<T>[] }
) 
```

### Logger Middleware

You can log your store for every action.

```tsx
import { useStateGlobal } from "state-jet";

const loggerMiddleware = (key: string, prev: number, next: number) => {
  console.log(`[state-jet] ${key}: ${prev} → ${next}`);
};

const counter = useStateGlobal("counter", 0, { middleware: [loggerMiddleware] });

export default function Counter() {
  const count = counter.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counter.set(count - 1)}>Decrement</button>
      <button onClick={() => counter.set(count + 1)}>Increment</button>
    </div>
  );
}
```

### Reducer Middleware

Can't live without reducer?. No worries. StateJet supports reducer middleware

```tsx
import { useStateGlobal } from "state-jet";

type Action<T> = { type: string; payload?: T };
type Middleware<T> = (
  key: string,
  prev: T,
  next: T | Action<T> | any,
  set?: (value: T) => void,
) => T | void | Promise<void>;

const reducerMiddleware: Middleware<number> = (key, prev, action: Action<any>) => {
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

const counter = useStateGlobal("counter", 0, { middleware: [reducerMiddleware] });

export default function Counter() {
  const count = counter.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counter.set({ type: "DECREMENT" })}>Decrement</button>
      <button onClick={() => counter.set({ type: "INCREMENT" })}>Increment</button>
      <button onClick={() => counter.set({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

### Optimistic Middleware

You can optimistically update global state with rollback support

```tsx
import { useStateGlobal } from "state-jet";

const optimisticMiddleware = (apiUrl: string) => {
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
const profile = useStateGlobal("profile", { name: "John" }, { 
    middleware: [optimisticMiddleware("/update-profile")],
});
```

### Custom Middleware

You can create your own custom middleware in state-jet

```tsx
import { useStateGlobal } from "state-jet";

const validateAgeMiddleware = (key: string, prev: number, next: number) => {
  if (key === "age" && next < 0) {
    console.warn("Age cannot be negative!");
    return prev;
  }
  return next;
};
const ageState = useStateGlobal("age", 0, { middleware: [validateAgeMiddleware] });

export default function Profile() {
  const age = ageState.useState() as number;

  return (
    <div>
      <h1>Age: {age}</h1>
      <button 
        onClick={() => {
          counter.set(-5) //Age will be 0 eventhough it updated with negative value due to middleware logic
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


## Contributing

Development of State-jet happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving State-jet.

- [Contributing Guide](./CONTRIBUTING.md)

### License

State-jet is [MIT licensed](./LICENSE).
