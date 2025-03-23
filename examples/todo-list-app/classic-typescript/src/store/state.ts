import { useStateGlobal } from "state-jet";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export const todoState = useStateGlobal<Todo[]>("todos", []);

export const filterState = useStateGlobal<"all" | "completed" | "pending">("filter", "all");
