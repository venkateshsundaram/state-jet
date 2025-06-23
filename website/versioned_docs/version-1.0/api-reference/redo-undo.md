---
sidebar_position: 5
id: redo-undo
title: Redo/Undo
slug: /api-reference/redo-undo/
description: Redo/Undo support for State-jet
keywords:
- Redo
- Undo
- redo
- undo
---

The `undo` and `redo` functions allow:

- **Time-travel debugging** (like Redux DevTools).
- **Undo/Redo user actions** (ideal for forms, text editors, drawing apps, etc.).
- **State history management** to track and restore previous values.

### ✅ Example 1: Undo/Redo in a Todo List 

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

type Todo = { id: number; text: string };

export const todoState = useStateGlobal<Todo[]>("todos", []);
```

Create a file at `src/components/TodoList.tsx`:

```tsx title="src/components/TodoList.tsx"
import { todoState } from "../store";

type Todo = { id: number; text: string };

export default function TodoApp() {
  const todos = todoState.useStore() as Todo[];

  const addTodo = (text: string) => {
    todoState.set([...todos, { id: Date.now(), text }]);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => addTodo("New Task")}>Add Todo</button>
      <button onClick={todoState.undo} disabled={!todos.length}>Undo</button>
      <button onClick={todoState.redo}>Redo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```
**✅ Now, added todos can be undone and redone! 🎉**


### ✅ Example 2: Undo/Redo in a Drawing Canvas

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

export const canvasState = useStateGlobal<{ lines: string[] }>("canvas", { lines: [] });
```

Create a file at `src/components/DrawingCanvas.tsx`:

```tsx title="src/components/DrawingCanvas.tsx"
import { canvasState } from "../store";

export default function DrawingApp() {
  const { lines } = canvasState.useStore() as { lines: string[] };

  const drawLine = () => {
    const newLine = `Line ${lines.length + 1}`;
    canvasState.set({ lines: [...lines, newLine] });
  };

  return (
    <div>
      <h1>Drawing Canvas</h1>
      <button onClick={drawLine}>Draw Line</button>
      <button onClick={canvasState.undo} disabled={!lines.length}>Undo</button>
      <button onClick={canvasState.redo}>Redo</button>
      <div>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

```
**✅ Now, users can undo/redo drawing actions dynamically! 🎉**

### ✅ Example 3: Undo/Redo in a Counter

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

export const counterState = useStateGlobal("counter", 0);
```

Create a file at `src/components/Counter.tsx`:

```tsx title="src/components/Counter.tsx"
import { counterState } from "../store";

export default function Counter() {
  const count = counterState.useStore() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counterState.set(count + 1)}>Increment</button>
      <button onClick={counterState.undo} disabled={count === 0}>Undo</button>
      <button onClick={counterState.redo}>Redo</button>
    </div>
  );
}
```
**✅ Now, you can undo/redo counter changes with a single click! 🎉**

## 🎯 Why Use undo & redo?

| Feature                | Without Undo/Redo       | With Undo/Redo            |
| ---------------------- | ----------------------- | ------------------------- |
| **Accidental Changes** | ❌ Lost forever          | ✅ Easily undone           |
| **User Experience**    | ❌ Frustrating           | ✅ Smooth & intuitive      |
| **Multi-Step Editing** | ❌ Hard to track         | ✅ Easy to restore history |
| **Performance**        | ❌ Needs manual tracking | ✅ Automatic               |