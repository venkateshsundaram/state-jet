# 🚀 state-jet: Ultra-Lightweight Global State for React

A zero-boilerplate, ultra-fast global state management library for React. No context, reducers, or providers—just simple reactive state.

## 🚀 Why state-jet?
- ✅ **No Context, No Providers** – Works outside React, reducing unnecessary re-renders.
- ✅ **Automatic Re-Renders** – Only components using specific state values update.
- ✅ **Super Lightweight** – Ultra small!
- ✅ **SSR & Next.js Support** – Works on both client and server.

## 🛠 Installation
```bash
npm install state-jet
```

## Example Usage
```bash
import { useStateGlobal } from "state-jet";

const counter = useStateGlobal("counter", 0);

function Counter() {
  const count = counter.useStore();
  return <button onClick={() => counter.set(count + 1)}>Count: {count}</button>;
}
```

## ⚡ Comparison Table

| Feature                  | Redux       | Recoil    | MobX          | Jotai     | Zustand                | state-jet            |
| ------------------------ | ----------- | --------- | ------------- | --------- | ---------------------- | --------------------- |
| Setup Required           | ✅ Yes       | ✅ Yes     | ⚠️ Yes        | ❌ No      | ⚠️ Minimal             | ❌ No                  |
| Bundle Size              | 🚀 Large    | 🚀 Medium | ⚡ Small       | ⚡ Small   | ⚡ Small        | 🔥 Ultra-Small |
| Reactivity               | ⚠️ Reducers | ✅ Atoms   | ✅ Proxy-Based | ✅ Signals | ✅ Proxy-Based          | ✅ Signal-Like         |
| Renders Only Affected    | ❌ No        | ✅ Yes     | ✅ Yes         | ✅ Yes     | ✅ Yes                  | ✅ Yes                 |
| Derived/Computed State   | ❌ No        | ✅ Yes     | ✅ Yes         | ✅ Yes     | ⚠️ Manual Selectors    | ✅ Yes (Automatic)     |
| Optimistic Updates       | ❌ No        | ❌ No      | ❌ No          | ❌ No      | ⚠️ Requires Middleware | ✅ Built-in            |
| Undo/Redo                | ❌ No        | ❌ No      | ❌ No          | ❌ No      | ⚠️ Requires Middleware | ✅ Built-in            |                |
| CRDT Conflict Resolution | ❌ No        | ❌ No      | ❌ No          | ❌ No      | ❌ No                   | ✅ Yes                 |


## ⚡ Why state-jet Is More Advanced Than Zustand

**No Proxies Needed** → Zustand uses proxies for state updates, but state-jet uses signals, making it even faster.
**Derived State Is Automatic** → No need for selectors; state updates only trigger where necessary.
**Optimistic Updates & Rollback** → Unlike Zustand, state-jet has built-in support for instant UI updates and auto-revert on failures.
**Multi-Tab Sync** → WebSocket and IndexedDB syncing, so global state persists across browser tabs and devices.
**CRDT Support** → Automatic conflict resolution for real-time apps, something even Zustand lacks.

✅ Conclusion

If you need the simplest, fastest, and most advanced state management solution for React, state-jet beats Redux, Recoil, MobX, Jotai, and even Zustand in performance, reactivity, and developer experience. 🚀