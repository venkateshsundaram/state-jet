"use client";

import { todoState } from "../store/state";
import { Todo } from "../types";

export default function TodoStats() {
  const todos = todoState.useState() as Todo[];

  const completed = todos.filter((todo) => todo.completed).length;
  const total = todos.length;

  return (
    <div className="flex justify-between items-center py-6 px-4 text-slate-500 font-semibold border-t border-slate-100 mt-10">
      <div className="flex gap-4">
        <span>Total: <span className="text-slate-800">{total}</span></span>
        <span>Done: <span className="text-green-600">{completed}</span></span>
      </div>
      {total > 0 && (
        <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-xs font-black">
          {Math.round((completed / total) * 100)}% Complete
        </span>
      )}
    </div>
  );
}
