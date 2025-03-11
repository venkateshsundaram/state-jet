import { useStateGlobal } from "state-jet";


type Action<T> = { type: string; payload?: T };

export const reducerMiddleware = (key: string, prev: number, action: Action<any>) => {
    switch (action.type) {
        case "INCREMENT":
            return prev + 1;
        case "DECREMENT":
            return prev - 1;
        case "RESET":
            return 0;
        default:
            return prev;
    }
};
const counter = useStateGlobal("counter", 0, { middleware: [reducerMiddleware] });

export default function Counter() {
  const count = counter.useStore() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counter.set(count + 1)}>Increment</button>
      <button onClick={counter.undo} disabled={count === 0}>Undo</button>
      <button onClick={counter.redo}>Redo</button>
    </div>
  );
}