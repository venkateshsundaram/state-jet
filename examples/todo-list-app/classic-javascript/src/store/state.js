import { useStateGlobal } from "state-jet";

export const todoState = useStateGlobal("todos", []);

export const filterState = useStateGlobal("filter", "all");
