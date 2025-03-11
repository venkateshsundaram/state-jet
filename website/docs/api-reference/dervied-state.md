---
sidebar_position: 6
id: derived-state
title: Derived State
slug: /api-reference/derived-state/
description: Derived state support for State-jet
keywords:
- Derived state
- derived-state
---

The `derivedState` function allows you to:

- Automatically compute **derived values** based on other state values.
- Avoid unnecessary recomputation by only **updating when dependencies change**.
- Improve performance in **complex calculations** (e.g., filtering, aggregations, price totals).

### Example: Filtered Todo List (Derived State)

This **automatically updates the filtered list when the state changes**.

Create a file at `src/components/TodoApp.tsx`:

```jsx title="src/components/TodoApp.tsx"
import { useStateGlobal, derivedState } from "state-jet";

export type Todo = { id: number; text: string; completed: boolean };

const todoStore = useStateGlobal<Todo[]>("todos", []);
const filterStore = useStateGlobal<"all" | "completed" | "pending">("filter", "all");

// Derived state for filtered todos
const filteredTodos = derivedState([todoStore, filterStore], (todos, filter) => {
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  if (filter === "pending") return todos.filter((todo) => !todo.completed);
  return todos;
});

export default function TodoApp() {
  const todos = filteredTodos();

  const addTodo = (text: string) => {
    todoStore.set([...todos, { id: Date.now(), text, completed: false }]);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => addTodo("New Task")}>Add Todo</button>
      <select onChange={(e) => filterStore.set(e.target.value as any)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```
**✅ Now, filtered todos update automatically based on the selected filter! 🎉**

## 🎯 Why Use `derivedState`?

| Feature                   | Without `derivedState`     | With `derivedState`           |
| ------------------------- | -------------------------- | ----------------------------- |
| **Manual Recalculations** | ❌ Yes (Recompute manually) | ✅ Automatic                   |
| **Reactivity**            | ❌ Requires `useEffect`     | ✅ Updates only when needed    |
| **Performance**           | ❌ Unoptimized              | ✅ Only recalculates on change |
| **Code Complexity**       | ❌ High                     | ✅ Minimal                     |