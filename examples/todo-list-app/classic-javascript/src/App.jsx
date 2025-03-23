import { useState } from "react";
import { todoState } from "./store/state";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";
import TodoFilters from "./components/TodoFilters";

export default function App() {
  const [text, setText] = useState("");
  const todos = todoState.useState();

  const addTodo = (text) => {
    todoState.set([...todos, { id: Date.now(), text, completed: false }]);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a new todo" />
      <button
        onClick={() => {
          addTodo(text);
          setText("");
        }}
      >
        Add
      </button>
      <TodoFilters />
      <TodoList />
      <TodoStats />
    </div>
  );
}
