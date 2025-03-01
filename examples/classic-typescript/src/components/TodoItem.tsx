// src/components/TodoItem.tsx
import { useState } from "react";
import { Todo, toggleTodo, editTodo, deleteTodo } from "../store/todoStore";

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
      {isEditing ? (
        <input value={newText} onChange={e => setNewText(e.target.value)} />
      ) : (
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</span>
      )}
      {isEditing ? (
        <button onClick={() => { editTodo(todo.id, newText); setIsEditing(false); }}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}
