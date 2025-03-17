import { produce } from "immer";
import { saveState, restoreState } from "./persistence";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";
import { globalObject } from "./global";

type Listener = () => void;
type Middleware<T> = (
  key: string,
  prev: T,
  next: T | Action<T>,
  set?: (value: T) => void,
) => T | void | Promise<void>;
type StoreValue<T> = {
  value: T;
  listeners: Set<Listener>;
  middleware?: Middleware<T>[];
  persist?: boolean;
  encrypt?: boolean;
};
type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};
type Action<T> = { type: string; payload?: T };

const activeMiddleware = new Set<string>();
const store = new Map<string, StoreValue<unknown>>(); // Use unknown to ensure safe type usage
const pendingUpdates = new Map<string, unknown>(); // Use unknown instead of any
const history: Record<string, HistoryState<unknown>> = {}; // Maintain type safety
let updateScheduled = false;

/**
 * Clears the global state store.
 */
export const clearGlobalState = () => {
  store.clear();
  Object.keys(history).forEach((key) => delete history[key]);
};

/**
 * Creates a global reactive state with middleware, persistence, and batch updates.
 */
export const useStateGlobal = <T>(
  key: string,
  initialValue?: T,
  options?: { middleware?: Middleware<T>[]; persist?: boolean; encrypt?: boolean },
) => {
  if (!store.has(key)) {
    let restoredValue = initialValue;
    if (options?.persist) {
      restoredValue = options?.encrypt
        ? (restoreEncryptedState(key, initialValue) as T)
        : restoreState(key, initialValue);
    }

    store.set(
      key,
      {
        value: restoredValue as T,
        listeners: new Set(),
        ...options,
      } as StoreValue<unknown>, // ✅ Use `as` to ensure type correctness
    );
  }

  const state = store.get(key)!;

  const undo = () => {
    if (history[key]?.past.length) {
      history[key].future.unshift(history[key].present);
      history[key].present = history[key].past.pop()!;
      state.value = history[key].present;
      state.listeners.forEach((listener) => listener());
      undoState(key);
    }
  };

  const redo = () => {
    if (history[key]?.future.length) {
      history[key].past.push(history[key].present);
      history[key].present = history[key].future.shift()!;
      state.value = history[key].present;
      state.listeners.forEach((listener) => listener());
      redoState(key);
    }
  };

  /**
   * Executes all pending updates in batch mode.
   */
  const batchUpdate = async <T>() => {
    updateScheduled = false;

    const updates = Array.from(pendingUpdates.entries()); // Convert Map to Array
    pendingUpdates.clear(); // Prevent infinite loops

    for (const [key, newValue] of updates) {
      const state = store.get(key)!;
      if (activeMiddleware.has(key)) {
        console.warn(`[state-jet] Skipping recursive middleware call for: ${key}`);
        continue; // Prevent recursive execution
      }

      let nextValue = newValue as unknown as T;
      const stateValue = state.value as T;

      if (!history[key]) {
        history[key] = { past: [], present: stateValue, future: [] };
      }
      history[key].past.push(stateValue);
      history[key].present = nextValue;
      history[key].future = [];

      // ✅ Prevent recursive calls
      activeMiddleware.add(key);

      if (state?.middleware) {
        for (const mw of state.middleware) {
          try {
            console.log(`[state-jet] Running middleware for ${key}`);

            // Pass state through each middleware in sequence
            const result = mw(key, stateValue, nextValue, (value: unknown) => {
              nextValue = value as T;
            });
            if (result !== undefined) {
              if (result instanceof Promise) {
                const awaitedResult = await result;
                if (awaitedResult !== undefined) {
                  nextValue = awaitedResult as T;
                }
              } else {
                nextValue = result as T;
              }
            }
          } catch (error) {
            console.error(`[state-jet] Middleware error in ${key}:`, error);
          }
        }
      }

      activeMiddleware.delete(key); // ✅ Allow future updates for this key

      if (typeof nextValue === "function") {
        state.value = produce(state.value, nextValue as (draft: T) => T);
      } else if (stateValue !== nextValue) {
        state.value = nextValue;
        state.listeners.forEach((listener) => listener());
        notifyDevTools(key, nextValue);
        measurePerformance(key, () => {});

        if (state?.persist) {
          if (state?.encrypt) saveEncryptedState(key, nextValue);
          else saveState(key, nextValue);
        }
      }
    }
    pendingUpdates.clear();
  };

  const useStore = () => {
    return useSyncExternalStore(
      (callback) => {
        state.listeners.add(callback);
        return () => state.listeners.delete(callback);
      },
      () => state.value as T,
    );
  };

  const clear = () => {
    state.value = initialValue;
    clearGlobalState();
  };

  const set = (newValue: T | ((prev: T) => T) | Action<T>, immediate: boolean = false) => {
    const currentValue = state.value as T;
    const nextValue =
      typeof newValue === "function" ? (newValue as (prev: T) => T)(currentValue) : newValue;

    // Directly set the next value in pendingUpdates to trigger immediate state update
    if (immediate) {
      state.value = nextValue as T;
      state.listeners.forEach((listener) => listener());
      return;
    }

    // Otherwise, queue the update for batch processing
    pendingUpdates.set(key, nextValue);

    // Trigger batchUpdate for non-immediate updates
    if (!updateScheduled) {
      updateScheduled = true;
      if (globalObject?.requestAnimationFrame) {
        globalObject.requestAnimationFrame(batchUpdate);
      } else {
        batchUpdate(); // Schedule a batch update
      }
    }
  };

  return {
    useStore,
    set,
    undo,
    redo,
    clear,
  };
};
