import { useState } from "react";
import { TodoList } from "./components/TodoList";
import { TodoFilters } from "./components/TodoFilters";
import { TodoStats } from "./components/TodoStats";
import { todoState } from "./store/state";

function App() {
  const todos = todoState.useState();
  const [inputValue, setInputValue] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
    };

    todoState.set([...todos, newTodo]);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 shadow-sm">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white">
            <h1 className="text-4xl font-black tracking-tight mb-2">My Journey</h1>
            <p className="text-indigo-100 font-medium">Capture your thoughts, one task at a time.</p>
          </div>
          <div className="p-8">
            <form onSubmit={addTodo} className="relative mb-10 group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What's on your mind today?"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 pr-32 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-300 text-lg shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-200 flex items-center gap-2"
              >
                <span>Add</span>
                <span className="text-xl">+</span>
              </button>
            </form>
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <TodoFilters />
                <TodoStats />
              </div>
              <div className="min-h-[300px]">
                <TodoList />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-slate-400 text-sm font-medium">
              Powered by <span className="text-indigo-500 font-bold tracking-wider">StateJet</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
