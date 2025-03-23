import { filterState } from "../store/state";

export default function TodoFilters() {
  const filter = filterState.useStore();

  return (
    <div style={{ margin: "1rem 0" }}>
      <button onClick={() => filterState.set("all")} disabled={filter === "all"}>
        All
      </button>
      <button onClick={() => filterState.set("completed")} disabled={filter === "completed"}>
        Completed
      </button>
      <button onClick={() => filterState.set("pending")} disabled={filter === "pending"}>
        Pending
      </button>
    </div>
  );
}
