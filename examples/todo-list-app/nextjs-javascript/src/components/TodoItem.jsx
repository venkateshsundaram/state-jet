"use client";

import { useState } from "react";
import { todoState } from "../store/state";

export default function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const todos = todoState.useState();

  const toggleTodo = (id) => {
    todoState.set(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const editTodo = (id, text) => {
    todoState.set(todos.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const deleteTodo = (id) => {
    todoState.set(todos.filter((t) => t.id !== id));
  };

  return (
    <li className="group flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all duration-300">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-slate-200 checked:border-blue-500 checked:bg-blue-500 transition-all"
        />
        <svg
          className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <div className="flex-1">
        {isEditing ? (
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editTodo(todo.id, newText);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="w-full bg-slate-50 border-b-2 border-blue-500 focus:outline-none py-1 text-slate-700 font-medium"
          />
        ) : (
          <span
            className={`block font-medium transition-all ${
              todo.completed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!todo.completed && (isEditing ? (
          <button
            onClick={() => {
              editTodo(todo.id, newText);
              setIsEditing(false);
            }}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
        ))}
        <button
          onClick={() => deleteTodo(todo.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
    </li>
  );
}
