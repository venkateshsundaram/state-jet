import { useState } from "react";
import { todoStore } from "./store/todoStore";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";
import TodoFilters from "./components/TodoFilters";

export default function App() {
  const [text, setText] = useState("");
  const todos = todoStore.useStore();

  const addTodo = (text: string) => {
    todoStore.set([...todos, { id: Date.now(), text, completed: false }]);
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
