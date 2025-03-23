import { useState } from "react";
import { todoState } from "../store/state";

export default function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const todos = todoState.useState();

  const toggleTodo = (id) => {
    todoState.set(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const editTodo = (id, newText) => {
    todoState.set(todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)));
  };

  const deleteTodo = (id) => {
    todoState.set(todos.filter((todo) => todo.id !== id));
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
