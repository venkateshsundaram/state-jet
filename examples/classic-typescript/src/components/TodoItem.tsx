import { useState } from "react";
import { Todo, todoStore } from "../store/todoStore";

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const todos = todoStore.useStore();

  const toggleTodo = (id: number) => {
    todoStore.set(
      todos.map((todo: Todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const editTodo = (id: number, newText: string) => {
    todoStore.set(todos.map((todo: Todo) => (todo.id === id ? { ...todo, text: newText } : todo)));
  };

  const deleteTodo = (id: number) => {
    todoStore.set(todos.filter((todo: Todo) => todo.id !== id));
  };

  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
      {isEditing ? (
        <input value={newText} onChange={(e) => setNewText(e.target.value)} />
      ) : (
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          {todo.text}
        </span>
      )}
      {isEditing ? (
        <button
          onClick={() => {
            editTodo(todo.id, newText);
            setIsEditing(false);
          }}
        >
          Save
        </button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}
