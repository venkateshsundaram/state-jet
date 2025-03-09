import { useStateGlobal } from "state-jet";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export const todoStore = useStateGlobal<Todo[]>("todos", []);

export const filterStore = useStateGlobal<"all" | "completed" | "pending">("filter", "all");
