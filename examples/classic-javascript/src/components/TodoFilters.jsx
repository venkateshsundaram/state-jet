import { filterStore } from "../store/todoStore";

export default function TodoFilters() {
  const filter = filterStore.useStore();

  return (
    <div style={{ margin: "1rem 0" }}>
      <button onClick={() => filterStore.set("all")} disabled={filter === "all"}>All</button>
      <button onClick={() => filterStore.set("completed")} disabled={filter === "completed"}>Completed</button>
      <button onClick={() => filterStore.set("pending")} disabled={filter === "pending"}>Pending</button>
    </div>
  );
}
