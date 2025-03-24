import { todoState, filterState } from "../store/state";
import TodoItem from "./TodoItem";
import { Todo } from "../types";

export default function TodoList() {
  const todos = todoState.useState() as Todo[];
  const filter = filterState.useState();

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
