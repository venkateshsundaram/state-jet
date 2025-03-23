import { todoState, filterState } from "../store/state";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = todoState.useState();
  const filter = filterState.useState();

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
