import React, { useState } from "react";
import { todoState } from "../store/state";
import { Todo } from "../types";

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const todos = todoState.useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const toggleTodo = () => {
    todoState.set(
      todos.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = () => {
    todoState.set(todos.filter((t) => t.id !== todo.id));
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    todoState.set(
      todos.map((t) =>
        t.id === todo.id ? { ...t, text: editText.trim() } : t
      )
    );
    setIsEditing(false);
  };

  return (
    <div className={`group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${
      todo.completed ? "bg-slate-50/50 grayscale-[0.5]" : "bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100"
    }`}>
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleTodo}
          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
            todo.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 hover:border-indigo-500"
          }`}
        >
          {todo.completed && <span className="text-sm">✓</span>}
        </button>

        {isEditing ? (
          <form onSubmit={saveEdit} className="flex-1 mr-4">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-50 border-2 border-indigo-200 rounded-xl py-2 px-4 focus:outline-none focus:border-indigo-500"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <span
            onClick={toggleTodo}
            className={`text-lg font-medium cursor-pointer transition-all ${
              todo.completed ? "text-slate-400 line-through" : "text-slate-700"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!todo.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            ✏️
          </button>
        )}
        <button
          onClick={deleteTodo}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
