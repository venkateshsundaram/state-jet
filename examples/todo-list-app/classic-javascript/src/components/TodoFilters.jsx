import { filterState } from "../store/state";

export const TodoFilters = () => {
  const filter = filterState.useState();

  const filters = [
    { id: "all", label: "All", icon: "📋" },
    { id: "pending", label: "Pending", icon: "⏳" },
    { id: "completed", label: "Completed", icon: "✅" },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => filterState.set(f.id)}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
            filter === f.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <span>{f.icon}</span>
          <span className="hidden sm:inline">{f.label}</span>
        </button>
      ))}
    </div>
  );
};
