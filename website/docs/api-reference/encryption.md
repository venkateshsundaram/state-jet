---
sidebar_position: 4
id: encryption
title: Encryption
slug: /api-reference/encryption/
description: Encryption store data for State-jet
keywords:
- encryption
- decryption
---

A `persist` and `encrypt` from `options` enables data persistence and encryption support for State-Jet.

### ✅ Example: Persisting a Counter State Across Reloads `with persist and encrypt` options

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { useStateGlobal } from "state-jet";

export type Todo = { id: number; text: string; completed: boolean };

const todoStore = useStateGlobal<Todo[]>("todos", [], { persist: true, encrypt: true });

export default function TodoApp() {
  const todos = todoStore.useStore() as Todo[];
  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false }];
    todoStore.set(newTodos);
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

### ✅ Example: Persisting a Counter State Across Reloads `without persist and encrypt` options

The `saveEncryptedState` and `restoreEncryptedState` functions helps to override existing global state without `persist, encrypt` options

This example demonstrates how to:

1. **Save the counter state with encrypt** (`saveEncryptedState`)
2. **Restore it when the page reloads with decryption** (`restoreEncryptedState`)

By default when you add `persist` and `encrypt` as `true`, State-jet internally call above two functions. But this example helps to achieve overriding from toplevel.

Create a file at `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { useStateGlobal, saveEncryptedState, restoreEncryptedState } from "state-jet";

export type Todo = { id: number; text: string; completed: boolean };

const todoStore = useStateGlobal<Todo[]>("todos", restoreEncryptedState("todos", []) as Todo[]);

export default function TodoApp() {
  const todos = todoStore.useStore() as Todo[];
  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false }];
    todoStore.set(newTodos);
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
