---
sidebar_position: 10
id: optimistic-update
title: Optimistic Update
slug: /api-reference/optimistic-update/
description: Optimistic update for State-jet
keywords:
- optimistic-update
- optimisticUpdate
---

A `optimisticUpdate` function from `state-jet` helps for Fast UI Updates with Rollback.

It allows you to:

1. **Instantly update the UI** (without waiting for a server response).
2. **Revert changes (rollback)** if the API request fails.


### ✅ Example: Optimistic Todo List (Reverts if API Fails)

This example adds a **todo immediately** but **removes it if the API request fails**.

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

type Todo = { id: number; text: string; completed: boolean };

export const todoState = useStateGlobal<Todo[]>("todos", []);
```

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { optimisticUpdate } from "state-jet";
import { todoState } from "../store";

type Todo = { id: number; text: string; completed: boolean };

// Fake API call (50% failure rate)
const fakeApiCall = () =>
  new Promise((resolve, reject) => setTimeout(() => (Math.random() > 0.5 ? resolve("OK") : reject("Error")), 1000));

export default function TodoApp() {
  const todos = todoState.useState() as Todo[];

  const addTodo = (text: string) => {
    optimisticUpdate(
      todoState,
      (prev) => [...prev, { id: Date.now(), text, completed: false }], // Optimistic Add
      fakeApiCall,
      (prev) => prev.slice(0, -1) // Rollback (Remove last added todo)
    );
  };

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => addTodo("New Task")}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 🎯 Why Use `optimisticUpdate`?

| Feature                 | Without `optimisticUpdate` | With `optimisticUpdate`     |
| ----------------------- | -------------------------- | --------------------------- |
| **UI Responsiveness**   | Delayed (Waits for API)    | Instant update (Optimistic) |
| **User Experience**     | Slow & Janky               | Fast & Smooth               |
| **Rollback on Failure** | Manual Handling            | Automatic                   |
| **Code Complexity**     | High                       | Low                         |
