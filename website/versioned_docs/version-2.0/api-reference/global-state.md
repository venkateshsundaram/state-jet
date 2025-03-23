---
sidebar_position: 1
id: global-state
title: useStateGlobal()
slug: /api-reference/global-state/
description: Global state set up for State-jet
keywords:
- global state
- global-state
---

An `useStateGlobal()` represents single key-value state	in State-jet.
```jsx
function useStateGlobal<T>(
    key: string,
    initialValue?: T,
    options?: { middleware?: Middleware<T>[], persist?: boolean, encrypt?: boolean }
) 
```

- `key` - A unique string used to identify the global state.

- `initialValue` - can holds any data types (string, array, object)

- `options` - An optional parameter which supports multiple options
   * `middleware` - which is used to add middleware support for state jet. *Refer* (**[Middlewares](/docs/api-reference/middlewares)**)
   * `persist` - if persist is true, the state data will be stored in localStorage. *Refer*(**[Persistence](/docs/api-reference/persistence)**)
   * `encrypt` - supports encryption/decryption. *Refer* (**[Encryption](/docs/api-reference/encryption)**)

   The function returns the following properties:  
        - **`set()`** – Updates the state data.  
        - **`useState()`** – Retrieves the latest state data.  
        - **`undo()`** – Reverts the state to the previous value. *Refer* (**[Undo](/docs/api-reference/redo-undo)**)
        - **`redo()`** – Restores the undone state. *Refer* (**[Redo](/docs/api-reference/redo-undo)**)
        - **`clear()`** – Resets the state data. *Refer* (**[Clear](/docs/api-reference/redo-undo)**)

:::warning

In state-jet@v1, the `useStore()` function was used to retrieve the latest state data. However, this functionality has now been replaced by `useState()`. Starting from v1, the `useStore()` function is used to create a new store.

:::

### ✅ Example: Creating global state for counterApp

Create a file at `src/components/Counter.tsx`:

```tsx title="src/components/Counter.tsx"
import { useStateGlobal } from "state-jet";

const counter = useStateGlobal("counter", 0);

export default function Counter() {
  const count = counter.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counter.set(count - 1)}>decrement</button>
      <button onClick={() => counter.set(count + 1)}>Increment</button>
    </div>
  );
}
```
    