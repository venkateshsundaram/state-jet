# 🚀 state-jet: Ultra-Lightweight Global State for React

A zero-boilerplate, ultra-fast global state management library for React. No context, reducers, or providers—just simple reactive state.

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
| Easy Setup           | ❌ No       | ❌ No     | ⚠️ No        | ❌ No      | ⚠️ Minimal             | ✅ Ultra-Minimal                  |
| Bundle Size              | 🚀 Large    | 🚀 Medium | ⚡ Small       | ⚡ Small   | ⚡ Small        | 🔥 Ultra-Small |
| Reactivity               | ⚠️ Reducers | ✅ Atoms   | ✅ Proxy-Based | ✅ Signals | ✅ Proxy-Based          | ✅ Signal-Like         |
| Renders Only Affected    | ❌ No        | ✅ Yes     | ✅ Yes         | ✅ Yes     | ✅ Yes                  | ✅ Yes                 |
| Derived/Computed State   | ❌ No        | ✅ Yes     | ✅ Yes         | ✅ Yes     | ⚠️ Manual Selectors    | ✅ Yes (Automatic)     |
| Optimistic Updates       | ❌ No        | ❌ No      | ❌ No          | ❌ No      | ⚠️ Requires Middleware | ✅ Built-in            |
| Undo/Redo                | ❌ No        | ❌ No      | ❌ No          | ❌ No      | ⚠️ Requires Middleware | ✅ Built-in            |                |
| CRDT Conflict Resolution | ❌ No        | ❌ No      | ❌ No          | ❌ No      | ❌ No                   | ✅ Yes                 |


## ⚡ Why state-jet Is More Advanced Than Zustand

- **No Proxies Needed** → Zustand uses proxies for state updates, but state-jet uses signals, making it even faster.
- **Derived State Is Automatic** → No need for selectors; state updates only trigger where necessary.
- **Optimistic Updates & Rollback** → Unlike Zustand, state-jet has built-in support for instant UI updates and auto-revert on failures.
- **Multi-Tab Sync** → global state persists across browser tabs and devices.
- **CRDT Support** → Automatic conflict resolution for real-time apps, something even Zustand lacks.

✅ Conclusion

If you need the simplest, fastest, and most advanced state management solution for React, state-jet beats Redux, Recoil, MobX, Jotai, and even Zustand in performance, reactivity, and developer experience. 🚀

## 🎯 Why Use `optimisticUpdate`?
| Feature                 | Without `optimisticUpdate` | With `optimisticUpdate`     |
| ----------------------- | -------------------------- | --------------------------- |
| **UI Responsiveness**   | Delayed (Waits for API)    | Instant update (Optimistic) |
| **User Experience**     | Slow & Janky               | Fast & Smooth               |
| **Rollback on Failure** | Manual Handling            | Automatic                   |
| **Code Complexity**     | High                       | Low                         |


## 🎯 Why Use `syncCRDT`?
| Feature                | Without `syncCRDT` | With `syncCRDT`           |
| ---------------------- | ------------------ | ------------------------- |
| **Multi-User Sync**    | Possible Conflicts | ✅ Automatic Merging       |
| **Real-Time Updates**  | Needs Manual Fixes | ✅ No Data Loss            |
| **Handles Conflicts**  | Can Lose Changes   | ✅ Merges Automatically    |
| **Scalable for Teams** | Hard to Maintain   | ✅ Ideal for Collaboration |


## 🎯 Why Use `derivedState`?

| Feature                   | Without `derivedState`     | With `derivedState`           |
| ------------------------- | -------------------------- | ----------------------------- |
| **Manual Recalculations** | ❌ Yes (Recompute manually) | ✅ Automatic                   |
| **Reactivity**            | ❌ Requires `useEffect`     | ✅ Updates only when needed    |
| **Performance**           | ❌ Unoptimized              | ✅ Only recalculates on change |
| **Code Complexity**       | ❌ High                     | ✅ Minimal                     |

## 🎯 Why Use undo & redo?

| Feature                | Without Undo/Redo       | With Undo/Redo            |
| ---------------------- | ----------------------- | ------------------------- |
| **Accidental Changes** | ❌ Lost forever          | ✅ Easily undone           |
| **User Experience**    | ❌ Frustrating           | ✅ Smooth & intuitive      |
| **Multi-Step Editing** | ❌ Hard to track         | ✅ Easy to restore history |
| **Performance**        | ❌ Needs manual tracking | ✅ Automatic               |
