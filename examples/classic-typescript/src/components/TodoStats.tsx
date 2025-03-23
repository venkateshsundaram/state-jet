import { todoState, Todo } from "../store/state";

export default function TodoStats() {
  const todos = todoState.useState() as Todo[];
  const completed = todos.filter((todo: Todo) => todo.completed).length;

  return (
    <div>
      <p>Total Todos: {todos.length}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {todos.length - completed}</p>
    </div>
  );
}
