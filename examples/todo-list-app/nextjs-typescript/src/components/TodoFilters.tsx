"use client";

import { filterState } from "../store/state";

export default function TodoFilters() {
  const currentFilter = filterState.useState();

  const filters = [
    { label: "All Tasks", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => filterState.set(f.value as any)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
            currentFilter === f.value
              ? "bg-white text-blue-600 shadow-sm shadow-blue-100"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
