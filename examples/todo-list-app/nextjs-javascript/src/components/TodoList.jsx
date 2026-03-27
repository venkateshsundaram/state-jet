"use client";

import { todoState, filterState } from "../store/state";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = todoState.useState();
  const filter = filterState.useState();

  const filteredTodos = (todos || []).filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  if (!todos || todos.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-slate-400 font-medium text-lg">Your list is clear!</p>
        <p className="text-slate-300 text-sm">Add a new task to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {filteredTodos.length === 0 && (
        <div className="py-12 text-center text-slate-400 font-medium">
          No {filter} items found.
        </div>
      )}
    </ul>
  );
}
