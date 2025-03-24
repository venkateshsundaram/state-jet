# 🚀 state-jet: Ultra-Lightweight Global State for React

A zero-boilerplate, ultra-fast global state management library for React. No context, reducers, or providers—just simple reactive state.

For more Information, see [here](https://statejet.netlify.app).

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

```bash
import { useStateGlobal } from "state-jet";

const counter = useStateGlobal("counter", 0);

function Counter() {
  const count = counter.useState();
  return <button onClick={() => counter.set(count + 1)}>Count: {count}</button>;
}
```
## ⚡ Why state-jet Is More Advanced Than Zustand

- **No Proxies Needed** → Zustand uses proxies for state updates, but state-jet uses signals, making it even faster.
- **Derived State Is Automatic** → No need for selectors; state updates only trigger where necessary.
- **Optimistic Updates & Rollback** → Unlike Zustand, state-jet has built-in support for instant UI updates and auto-revert on failures.
- **Multi-Tab Sync** → global state persists across browser tabs and devices.
- **CRDT Support** → Automatic conflict resolution for real-time apps, something even Zustand lacks.

### ✅Conclusion

If you need the simplest, fastest, and most advanced state management solution for React, state-jet beats Redux, Recoil, MobX, Jotai, and even Zustand in performance, reactivity, and developer experience. 🚀

## Create Slice

```bash
import { useSlice } from "state-jet";

export const useProductSlice = () => useSlice("products")("list", []);

export const useCartSlice = () =>
  useSlice("cart")("items", []);

export const useUserSlice = () => useSlice("user")("info", null);
```

## Create Store

```bash
import { useStore } from "state-jet";
import { useProductSlice, useCartSlice, useUserSlice } from "./slices";

const initializer: any = () => ({
  products: useProductSlice(),
  cart: useCartSlice(),
  user: useUserSlice()
});

export const useEcommerceStore = () =>  useStore(initializer);
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
