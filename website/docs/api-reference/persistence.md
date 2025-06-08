---
sidebar_position: 5
id: persistence
title: Persistence
slug: /api-reference/persistence/
description: Persist data for State-jet
keywords:
- persistence
---

The `persist` property from `options` enables data persistence support for State-Jet. If encryption is required, you can secure your stored data, Refer (**[Encryption](/docs/api-reference/encryption)**)

### ✅ Example: Persisting a Counter State Across Reloads `with persist` option

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { useStateGlobal } from "state-jet";

export type Todo = { id: number; text: string; completed: boolean };

const todoState = useStateGlobal<Todo[]>("todos", [], { persist: true });

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

Persistence is supported only in web browsers. For native mobile environments, you can still use State-Jet without `persist` option, and integrate an external storage library to handle local data manually.

:::

### ✅ Example: Persisting a Counter State Across Reloads `without persist` option

The `saveState` and `restoreState` functions helps to override existing global state without `persist` option

This example demonstrates how to:

1. **Save the counter state** (`saveState`)
2. **Restore it when the page reloads** (`restoreState`)

By default when you add `persist` as `true`, State-jet internally call above two functions. But this example helps to achieve overriding from toplevel.

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { useStateGlobal, saveState, restoreState } from "state-jet";

export type Todo = { id: number; text: string; completed: boolean };

const todoState = useStateGlobal<Todo[]>("todos", restoreState("todos", []));

export default function TodoApp() {
  const todos = todoState.useState() as Todo[];
  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false }];
    todoState.set(newTodos);
    saveState("todos", newTodos); // Save new state
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
