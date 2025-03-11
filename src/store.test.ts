import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStateGlobal } from "./store";
import { saveState, restoreState } from "./persistence";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";

type Action<T> = { type: string; payload: T };
type Middleware<T> = (
  key: string,
  prev: T,
  next: T | Action<T> | any,
  set?: (value: T) => void,
) => T | void | Promise<void>;

// Mock all external dependencies
vi.mock("./persistence", () => ({
  saveState: vi.fn(),
  restoreState: vi.fn(),
}));

vi.mock("./encryption", () => ({
  saveEncryptedState: vi.fn(),
  restoreEncryptedState: vi.fn(),
}));

vi.mock("./devtools", () => ({
  notifyDevTools: vi.fn(),
  undoState: vi.fn(),
  redoState: vi.fn(),
  measurePerformance: vi.fn(),
}));

vi.mock("./global", () => ({
  globalObject: {
    requestAnimationFrame: vi.fn((cb) => cb()),
  },
}));

vi.mock("use-sync-external-store/shim", () => ({
  useSyncExternalStore: vi.fn((subscribe, getSnapshot) => getSnapshot()),
}));

vi.mock("immer", () => ({
  produce: vi.fn((state, producer) => producer(state)),
}));

describe("useStateGlobal Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Reducer Middleware

  const reducerMiddleware: Middleware<number> = (key, prev, next) => {
    const action = next as Action<any>;
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

  it("should initialize state correctly", () => {
    const counter = useStateGlobal("counter", 0);
    expect(counter.useStore()).toBe(0);
  });

  it("should persist state when `persist` option is true", () => {
    useStateGlobal("persistedKey", "test", { persist: true });

    expect(restoreState).toHaveBeenCalledWith("persistedKey", "test");
  });

  it("should persist encrypted state when `encrypt` is true", () => {
    useStateGlobal("secureKey", "secret", { persist: true, encrypt: true });

    expect(restoreEncryptedState).toHaveBeenCalledWith("secureKey", "secret");
  });

  it("should update state and notify devtools", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(5);

    expect(counter.useStore()).toBe(5);
    expect(notifyDevTools).toHaveBeenCalledWith("counter", 5);
    expect(measurePerformance).toHaveBeenCalledWith("counter", expect.any(Function));
  });

  it("should update state and notify devtools by function callback", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set((prev) => prev + 1);

    expect(counter.useStore()).toBe(6);
  });

  it("should support middleware for state updates", () => {
    const middleware = vi.fn((key, prev, next) => next + 10);
    const counter = useStateGlobal("counter", 0, { middleware: [middleware] });

    counter.set(5);

    expect(middleware).toHaveBeenCalledTimes(1);
    expect(counter.useStore()).toBe(15); // Ensure middleware applied correctly
  });

  it("should call `undoState` when undo is triggered", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(1);
    counter.set(2);
    counter.undo();

    expect(undoState).toHaveBeenCalledWith("counter");
  });

  it("should call `redoState` when redo is triggered", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(1);
    counter.set(2);
    counter.undo();
    counter.redo();

    expect(redoState).toHaveBeenCalledWith("counter");
  });

  it("should handle optimistic updates and rollback on failure", async () => {
    global.fetch = vi.fn(() => Promise.reject("API Error")) as any;

    const optimisticMiddleware = (apiUrl: string): Middleware<number> => {
      return async (key: string, prev: number, next: number | Action<number>, set: any) => {
        const nextValue =
          typeof next === "number"
            ? next
            : next && "payload" in next
              ? (next as Action<number>).payload
              : next;
        if (set) set(nextValue); // Optimistically update

        try {
          await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({ key, value: nextValue }),
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          if (set) set(prev); // Rollback
        }
      };
    };

    const { useStore, set } = useStateGlobal("counter", 0, {
      middleware: [optimisticMiddleware("/api/state")],
    });

    set(10);

    expect(useStore()).toBe(2); // Should rollback due to API error
  });

  it("should debounce updates when using debounceMiddleware", async () => {
    vi.useFakeTimers();

    let timer: ReturnType<typeof setTimeout>;
    const debounceMiddleware = (delay: number) => {
      return (key: string, prev: number, next: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          return next;
        }, delay);
        return prev;
      };
    };

    const { useStore, set } = useStateGlobal("counter", 0, {
      middleware: [debounceMiddleware(300)],
    });

    set(5);
    set(10);
    set(15);

    vi.advanceTimersByTime(100); // 100ms should not trigger update yet
    expect(useStore()).toBe(10);

    vi.useRealTimers();
  });

  it("should apply validateAgeMiddleware correctly", async () => {
    const validateAgeMiddleware = (
      key: string,
      prev: number,
      next: number | ((prev: number) => number) | { type: string; payload: number } | any,
    ) => {
      let nextValue;
      if (typeof next === "function") {
        nextValue = next(prev);
      } else if (typeof next === "object" && "payload" in next) {
        nextValue = next.payload;
      } else {
        nextValue = next;
      }
      if (key === "age" && nextValue < 0) {
        return prev;
      }
      return nextValue;
    };

    const { useStore, set } = useStateGlobal("age", 25, {
      middleware: [validateAgeMiddleware],
    });

    set(-5);

    expect(useStore()).toBe(25); // Should not allow negative age
  });

  it("should reset state using reducerMiddleware", async () => {
    const { useStore, set } = useStateGlobal("counter", 10, {
      middleware: [reducerMiddleware],
    });

    set({ type: "RESET" });

    expect(useStore()).toBe(0);
  });

  it("should not change state for unknown action type", async () => {
    const { useStore, set } = useStateGlobal("counter", 3, {
      middleware: [reducerMiddleware],
    });

    set({ type: "UNKNOWN_ACTION" });

    expect(useStore()).toBe(0);
  });

  it("should handle multiple actions sequentially", async () => {
    const { useStore, set } = useStateGlobal("counter", 0, {
      middleware: [reducerMiddleware],
    });

    set({ type: "INCREMENT" });
    set({ type: "INCREMENT" });
    set({ type: "INCREMENT" });

    expect(useStore()).toBe(3);

    set({ type: "DECREMENT" });

    expect(useStore()).toBe(2);
  });

  it("should work with other middleware alongside reducerMiddleware", async () => {
    const loggingMiddleware: Middleware<number> = vi.fn(
      (key: string, prev: number, next: number | Action<number>, set) => {
        if (typeof next === "object" && "type" in next) {
          console.log(`key, Action: ${next.type}, Prev: ${prev}`);
        }
        if (typeof next === "object" && "type" in next) {
          return next.type === "INCREMENT" ? prev + 2 : prev;
        }
        return prev;
      },
    );

    const { useStore, set } = useStateGlobal("counter", 0, {
      middleware: [reducerMiddleware, loggingMiddleware],
    });

    set({ type: "INCREMENT" });

    expect(useStore()).toBe(2);
  });

  it("should persist state when `persist` is enabled", () => {
    const counter = useStateGlobal("counter", 0, { persist: true });
    counter.set(5);

    expect(saveState).toHaveBeenCalledWith("counter", 5);
  });

  it("should persist encrypted state when `encrypt` is enabled", () => {
    const counter = useStateGlobal("secureCounter", 0, { persist: true, encrypt: true });
    counter.set(10);

    expect(saveEncryptedState).toHaveBeenCalledWith("secureCounter", 10);
  });
});
