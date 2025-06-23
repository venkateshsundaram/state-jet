---
sidebar_position: 11
id: crdt
title: Conflict-Free Replicated Data Type
slug: /api-reference/crdt/
description: crdt support for State-jet
keywords:
- crdt
- CRDT
- Conflict-Free Replicated Data Type
---

The `syncCRDT` function ensures automatic conflict resolution when syncing state across multiple users / devices.

It is **ideal for collaborative apps**, like:

- ✅ Shared Todo Lists
- ✅ Real-Time Note Taking
- ✅ Multi-User Document Editing
- ✅ Live Counters or Votes

## ✅ Example 1: CRDT-Based Shared Todo List

This **syncs todos across multiple users** and **merges conflicting changes automatically**.

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

type Todo = { id: number; text: string; completed: boolean };

export const todoState = useStateGlobal<Todo[]>("todos", []);
```

Setup WebSocket for Syncing (`src/socket/websocket.ts`):

```ts title="src/socket/websocket.ts"
import { todoState } from "../store";
const socket = new WebSocket("ws://localhost:4000");

socket.onmessage = (event) => {
  const { key, data } = JSON.parse(event.data);
  if (key === "todos") syncCRDT(data, todoState);
};

export const syncTodos = (state) => {
  socket.send(JSON.stringify({ key: "todos", data: state }));
};
```

Use CRDT in `src/components/TodoApp.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { syncCRDT } from "state-jet";
import { syncTodos } from "../socket/websocket";
import { todoState } from "../store";

type Todo = { id: number; text: string; completed: boolean };

export default function TodoApp() {
  const todos = todoState.useState() as Todo[];

  const addTodo = (text: string) => {
    const newTodos = [...todos, { id: Date.now(), text, completed: false }];
    syncCRDT(newTodos, todoState);
    syncTodos(newTodos); // Send to WebSocket
  };

  return (
    <div>
      <h1>Shared Todo List</h1>
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
**✅ Now, todos sync automatically across multiple users! 🎉**


## ✅ Example 2: Live Counter with CRDT Sync

This ensures **counter updates don’t get lost** when multiple users increment at the same time.

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

export const counterState = useStateGlobal("counter", { value: 0, lastUpdated: Date.now() });
```

Setup WebSocket for Syncing (`src/socket/websocket.ts`):

```ts title="src/socket/websocket.ts"
import { counterState } from "../store"

const socket = new WebSocket("ws://localhost:4000");

socket.onmessage = (event) => {
  const { key, data } = JSON.parse(event.data);
  if (key === "counter") syncCRDT(data, counterState);
};

export const syncCounter = (state) => {
  socket.send(JSON.stringify({ key: "counter", data: state }));
};
```

Use CRDT in `src/components/Counter.tsx`:

```tsx title="src/components/Counter.tsx"
import { syncCRDT } from "state-jet";
import { syncCounter } from "../socket/websocket";
import { counterState } from "../store";

export default function Counter() {
  const counter = counterState.useState();

  const increment = () => {
    const updatedCounter = { value: counter.value + 1, lastUpdated: Date.now() };
    syncCRDT(updatedCounter, counterState);
    syncCounter(updatedCounter); // Send update to WebSocket
  };

  return (
    <div>
      <h1>Live Counter: {counter.value}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```
**✅ Now, multiple users can increment the counter without conflicts! 🎉**


## ✅ Example 3: Real-Time Collaborative Notes

This **syncs text changes across users** with **CRDT conflict resolution**.

Create a file at `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";

export const noteState = useStateGlobal("notes", { content: "", lastUpdated: Date.now() });
```

Setup WebSocket Sync for Notes (`src/socket/websocket.ts`):

```ts title="src/socket/websocket.ts"
import { noteState } from "../store"
const socket = new WebSocket("ws://localhost:4000");

socket.onmessage = (event) => {
  const { key, data } = JSON.parse(event.data);
  if (key === "notes") syncCRDT(data, noteState);
};

export const syncNotes = (state) => {
  socket.send(JSON.stringify({ key: "notes", data: state }));
};
```

Use CRDT in `src/components/Notes.tsx`:

```tsx title="src/components/TodoApp.tsx"
import { syncCRDT } from "state-jet";
import { syncNotes } from "../socket/websocket";
import { noteState } from "../store";

export default function Notes() {
  const note = noteState.useState();

  const updateNote = (e) => {
    const updatedNote = { content: e.target.value, lastUpdated: Date.now() };
    syncCRDT(updatedNote, noteState);
    syncNotes(updatedNote); // Send update to WebSocket
  };

  return (
    <div>
      <h1>Collaborative Notes</h1>
      <textarea value={note.content} onChange={updateNote} />
    </div>
  );
}
```
**✅ Now, multiple users can edit notes at the same time without conflicts! 🎉**

## 🎯 Why Use `syncCRDT`?

| Feature                | Without `syncCRDT` | With `syncCRDT`           |
| ---------------------- | ------------------ | ------------------------- |
| **Multi-User Sync**    | Possible Conflicts | ✅ Automatic Merging       |
| **Real-Time Updates**  | Needs Manual Fixes | ✅ No Data Loss            |
| **Handles Conflicts**  | Can Lose Changes   | ✅ Merges Automatically    |
| **Scalable for Teams** | Hard to Maintain   | ✅ Ideal for Collaboration |
