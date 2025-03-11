import { todoStore, Todo } from "../store/todoStore";

export default function TodoStats() {
  const todos = todoStore.useStore() as Todo[];
  const completed = todos.filter((todo: Todo) => todo.completed).length;

  return (
    <div>
      <p>Total Todos: {todos.length}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {todos.length - completed}</p>
    </div>
  );
}
