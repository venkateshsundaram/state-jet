---
sidebar_position: 8
id: clear
title: Clear
slug: /api-reference/clear/
description: Clear store for State-jet
keywords:
- clear
---

The `clear` functions allow to reset existing all state data.

### ✅ Example 1: Clear in a Todo List 

Create a file at `src/components/TodoList.tsx`:

```tsx title="src/components/TodoList.tsx"
import { useStateGlobal } from "state-jet";

export type Todo = { id: number; text: string };

const todoState = useStateGlobal<Todo[]>("todos", []);

export default function TodoApp() {
  const todos = todoState.useState() as Todo[];

  const addTodo = (text: string) => {
    todoState.set([...todos, { id: Date.now(), text }]);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => addTodo("New Task")}>Add Todo</button>
      <button onClick={todoState.clear}>Clear</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```
**✅ Now, added todos can be resetted! 🎉**

