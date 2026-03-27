import { TodoItem } from "./TodoItem";
import { todoState, filterState } from "../store/state";

export const TodoList = () => {
  const todos = todoState.useState();
  const filter = filterState.useState();

  const filteredTodos = (todos || []).filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-slate-500 font-medium">Your list is clear!</p>
        <p className="text-slate-400 text-sm">Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
