---
sidebar_position: 6
id: encryption
title: Encryption
slug: /api-reference/encryption/
description: Encryption store data for State-jet
keywords:
- encryption
- decryption
---

The `persist` and `encrypt` properties in `options` enable data persistence and encryption support for State-Jet.

### ✅ Example: Persisting a Counter State Across Reloads `with persist and encrypt` options

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

type Todo = { id: number; text: string; completed: boolean };

export const todoState = useStateGlobal<Todo[]>("todos", [], { persist: true, encrypt: true });
```

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { todoState } from "../store";

type Todo = { id: number; text: string; completed: boolean };

export default function TodoApp() {
  const todos = todoState.useState() as Todo[];
  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false }];
    todoState.set(newTodos);
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

:::warning

Encryption is supported only in web browsers. For native mobile environments, you can still use State-Jet without `encrypt` and `persist` options, and integrate an external storage library to handle local data manually.

:::

### ✅ Example: Persisting a Counter State Across Reloads `without persist and encrypt` options

The `saveEncryptedState` and `restoreEncryptedState` functions helps to override existing global state without `persist, encrypt` options

This example demonstrates how to:

1. **Save the counter state with encrypt** (`saveEncryptedState`)
2. **Restore it when the page reloads with decryption** (`restoreEncryptedState`)

By default when you add `persist` and `encrypt` as `true`, State-jet internally call above two functions. But this example helps to achieve overriding from toplevel.

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal, restoreEncryptedState } from "state-jet";

type Todo = { id: number; text: string; completed: boolean };

export const todoState = useStateGlobal<Todo[]>("todos", restoreEncryptedState("todos", []) as Todo[]);
```

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { saveEncryptedState } from "state-jet";
import { todoState } from "../store";

type Todo = { id: number; text: string; completed: boolean };

export default function TodoApp() {
  const todos = todoState.useState() as Todo[];
  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false }];
    todoState.set(newTodos);
    saveEncryptedState("todos", newTodos); // Save new state
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
