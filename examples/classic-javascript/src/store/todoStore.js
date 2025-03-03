import { useStateGlobal } from "state-jet";

export const todoStore = useStateGlobal("todos", []);

export const filterStore = useStateGlobal("filter", "all");

