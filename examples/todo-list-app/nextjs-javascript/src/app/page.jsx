"use client";

import { useState } from "react";
import { todoState } from "@/store/state";
import TodoList from "@/components/TodoList";
import TodoStats from "@/components/TodoStats";
import TodoFilters from "@/components/TodoFilters";

export default function Home() {
  const [text, setText] = useState("");
  const todos = todoState.useState();

  const addTodo = (text) => {
    if (!text.trim()) return;
    todoState.set([...todos, { id: Date.now(), text, completed: false }]);
    setText("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-white">
          {/* Header */}
          <div className="bg-slate-900 px-10 py-12 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grid)"></path>
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
              </svg>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">My Journey</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">A StateJet Powered Todo List</p>
          </div>

          <div className="px-10 py-10 space-y-10">
            {/* Input Section */}
            <div className="relative group">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo(text);
                }}
                placeholder="What's next on your mind?"
                className="w-full pl-6 pr-32 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl text-slate-700 font-medium transition-all group-hover:bg-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:shadow-xl focus:shadow-blue-500/5"
              />
              <button
                onClick={() => addTodo(text)}
                disabled={!text.trim()}
                className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl font-bold transition-all transform active:scale-95 flex items-center gap-2"
              >
                <span>Add</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>

            {/* Filters */}
            <TodoFilters />

            {/* List */}
            <TodoList />

            {/* Stats */}
            <TodoStats />
          </div>
        </div>

        <p className="text-center mt-12 text-slate-400 font-medium">
          Built with <span className="text-indigo-400 font-black">StateJet</span> • Modern State Management
        </p>
      </div>
    </main>
  );
}
