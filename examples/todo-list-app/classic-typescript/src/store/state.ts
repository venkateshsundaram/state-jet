import { useStateGlobal } from "state-jet";
import { Todo } from "../types";

export const todoState = useStateGlobal<Todo[]>("todos", []);

export const filterState = useStateGlobal<"all" | "completed" | "pending">("filter", "all");
