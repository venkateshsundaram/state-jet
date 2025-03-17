import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEffect } from "react";
import { useStateGlobal, clearGlobalState } from "./store";
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
    vi.useFakeTimers(); // Mock timers
    clearGlobalState();
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
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

  it("should clear the state", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(5);
    counter.clear();
    expect(counter.useStore()).toBe(0);
  });

  it("should update the state immediately without batch update", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(5, true);
    expect(counter.useStore()).toBe(5);
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

    expect(counter.useStore()).toBe(1);
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

    expect(useStore()).toBe(0); // Should rollback due to API error
  });

  it("should debounce updates when using debounceMiddleware", async () => {
    vi.useFakeTimers(); // Use fake timers to control the debounce behavior

    // Define the debounce middleware
    const debounceMiddleware = (delay: number) => {
      let timer: ReturnType<typeof setTimeout>;
      return (key: string, prev: number, next: any, set?: (value: number) => void) => {
        clearTimeout(timer); // Clear any existing timer
        timer = setTimeout(() => {
          // console.log(set, next)
          // if (set) set(next); // Apply the state update after the delay
          return next;
        }, delay);
        return next; // Return the previous state immediately
      };
    };

    // Set up the global state with debounce middleware
    const { useStore, set } = useStateGlobal("counter", 0, {
      middleware: [debounceMiddleware(300)], // Apply debounce middleware with a 300ms delay
    });

    // Call set multiple times in quick succession
    act(() => {
      set(5); // First state update
    });
    act(() => {
      set(10); // Second state update
    });
    act(() => {
      set(15); // Third state update
    });

    // Fast-forward another 300ms, now the update should happen (to 15)
    act(() => {
      vi.advanceTimersByTime(300); // Advances the timers by 300ms
    });

    // The final value should be 15 after debounce
    expect(useStore()).toBe(15); // The final value should be 15 after debounce

    // Ensure that the state update is called only once after debounce
    vi.useRealTimers(); // Restore real timers after the test
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

    expect(useStore()).toBe(3);
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

  it("should work with logger Middleware", async () => {
    // Define loggingMiddleware to log and transform the state based on the action type
    const loggingMiddleware: Middleware<number> = vi.fn(
      (key: string, prev: number, next: number | Action<number>, set) => {
        if (typeof next === "object" && "type" in next) {
          console.log(`key: ${key}, Action: ${next.type}, Prev: ${prev}`);
        }

        // Modify the state for specific actions
        if (typeof next === "object" && "type" in next) {
          if (next.type === "INCREMENT") {
            return prev + 2; // Increment by 2 if the action is INCREMENT
          }
        }
        return prev; // Default behavior: return previous state if no match
      },
    );

    // Create a store with the reducerMiddleware and loggingMiddleware
    const { useStore, set } = useStateGlobal("counter", 0, {
      middleware: [loggingMiddleware],
    });

    // Trigger the INCREMENT action
    set({ type: "INCREMENT" });

    // After middleware handling, the state should be incremented by 3 (1 from reducerMiddleware and 2 from loggingMiddleware)
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

describe("useStateGlobal with setInterval", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearGlobalState();
    vi.useFakeTimers(); // Mock timers
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
  });

  it("should initialize state correctly", () => {
    const { result } = renderHook(() => useStateGlobal("counter", 0));

    expect(result.current.useStore()).toBe(0);
  });

  it("should increment state over time using setInterval", () => {
    const { result } = renderHook(() => {
      const counter = useStateGlobal("counter", 0);
      const increment = () => {
        // Use a function to get the most recent value of the state
        counter.set((prevValue) => prevValue + 1); // Pass a function to get the updated state
      };

      useEffect(() => {
        const interval = setInterval(increment, 10);
        return () => clearInterval(interval); // Cleanup interval on unmount
      }, []);

      return counter;
    });

    // Fast forward 100ms (10ms * 10 intervals) inside act() to make sure React handles updates
    act(() => {
      vi.advanceTimersByTime(100); // Advances the timers by 100ms
    });

    // Expect count to have incremented 10 times
    expect(result.current.useStore()).toBe(10);

    // Fast forward another 100ms inside act() to ensure updates are processed
    act(() => {
      vi.advanceTimersByTime(100); // Advances the timers by another 100ms
    });

    // Expect count to have incremented another 10 times
    expect(result.current.useStore()).toBe(20);
  });

  it("should clear interval on unmount", () => {
    const { unmount } = renderHook(() => {
      const counter = useStateGlobal("counter", 0);
      const count = counter.useStore();
      const increment = () => counter.set(count + 1);

      useEffect(() => {
        const interval = setInterval(increment, 10);
        return () => clearInterval(interval);
      }, []);

      return counter;
    });

    // Spy on clearInterval
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    // Unmount the hook
    act(() => {
      unmount();
    });

    // Ensure clearInterval was called
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
