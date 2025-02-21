import React from "react";
import { useStateGlobal } from "../src/index";
import { loggerMiddleware } from "../src/middleware";

const counter = useStateGlobal<number>("counter", 0, { middleware: [loggerMiddleware] });

export default function App() {
  const { undo, redo } = counter;
  const count = counter.useStore();

  return (
    <div>
      <button onClick={() => counter.set(count + 1)}>+</button>
      <button onClick={() => counter.set(count - 1)}>-</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <p>Count: {count}</p>
    </div>
  );
}
