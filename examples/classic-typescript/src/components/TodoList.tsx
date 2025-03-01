import { todoStore, filterStore, Todo } from "../store/todoStore";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = todoStore.useStore();
  const filter = filterStore.useStore();

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
