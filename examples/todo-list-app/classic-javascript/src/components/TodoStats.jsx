import { todoState } from "../store/state";

export const TodoStats = () => {
  const todos = todoState.useState();
  
  const total = (todos || []).length;
  const completed = (todos || []).filter((todo) => todo.completed).length;
  const pending = total - completed;

  return (
    <div className="flex gap-6 text-sm font-bold uppercase tracking-wider">
      <div className="flex flex-col items-end">
        <span className="text-slate-400 text-[10px] mb-1">Pending</span>
        <span className="text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">{pending}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-slate-400 text-[10px] mb-1">Completed</span>
        <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">{completed}</span>
      </div>
    </div>
  );
};
