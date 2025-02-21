# 🚀 state-jet: Ultra-Lightweight Global State for React

A zero-boilerplate, ultra-fast global state management library for React. No context, reducers, or providers—just simple reactive state.

## 🚀 Why state-jet?
- ✅ **No Context, No Providers** – Works outside React, reducing unnecessary re-renders.
- ✅ **Automatic Re-Renders** – Only components using specific state values update.
- ✅ **Super Lightweight** – Less than **1KB** minified!
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

## ⚡ Comparison with Zustand

|Feature|Redux|Recoil|MobX|Jotai|state-jet|
|:----|:----|:----|:----|:----|:----|
|Setup Required|✅ Yes|✅ Yes|⚠️ Yes|❌ No|❌ No|
|Bundle Size|🚀 Large|🚀 Medium|⚡ Small|⚡ Small|🔥 Ultra-Small (<1KB)|
|Reactivity|⚠️ Reducers|✅ Atoms|✅ Proxy-Based|✅ Signals|✅ Signal-Like|
|Renders Only Affected|❌ No|✅ Yes|✅ Yes|✅ Yes|✅ Yes|
|Derived/Computed State|❌ No|✅ Yes|✅ Yes|✅ Yes|✅ Yes|
|Optimistic Updates|❌ No|❌ No|❌ No|❌ No|✅ Yes|
|Undo/Redo|❌ No|❌ No|❌ No|❌ No|✅ Yes|
|WebSocket Multi-Tab Sync|❌ No|❌ No|❌ No|❌ No|✅ Yes|
|CRDT Conflict Resolution|❌ No|❌ No|❌ No|❌ No|✅ Yes|
