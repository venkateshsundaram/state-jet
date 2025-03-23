import { todoState, filterState, Todo } from "../store/state";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = todoState.useStore() as Todo[];
  const filter = filterState.useStore();

  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <ul>
      {filteredTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
