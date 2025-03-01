// src/store/todoStore.ts
import { useStateGlobal } from "state-jet";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export const todoStore = useStateGlobal<Todo[]>("todos", []);

export const filterStore = useStateGlobal<"all" | "completed" | "pending">("filter", "all");

// Actions
export const addTodo = (text: string) => {
  todoStore.set([...todoStore.useStore(), { id: Date.now(), text, completed: false }]);
};

export const toggleTodo = (id: number) => {
  todoStore.set(todoStore.useStore().map((todo: Todo) => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
};

export const editTodo = (id: number, newText: string) => {
  todoStore.set(todoStore.useStore().map((todo: Todo) => 
    todo.id === id ? { ...todo, text: newText } : todo
  ));
};

export const deleteTodo = (id: number) => {
  todoStore.set(todoStore.useStore().filter((todo: Todo) => todo.id !== id));
};
