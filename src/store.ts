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
  const batchUpdate = async () => {
    const updates = Array.from(pendingUpdates.entries()); // Convert Map to Array
    pendingUpdates.clear(); // Prevent infinite loops

    for (const [key, newValue] of updates) {
      if (activeMiddleware.has(key)) {
        console.warn(`[state-jet] Skipping recursive middleware call for: ${key}`);
        continue; // Prevent recursive execution
      }

      let nextValue = newValue as T;
      const stateValue = state.value as T;

      if (!history[key]) {
        history[key] = { past: [], present: stateValue, future: [] };
      }
      history[key].past.push(stateValue);
      history[key].present = nextValue;
      history[key].future = [];

      // ✅ Prevent recursive calls
      activeMiddleware.add(key);

      if (options?.middleware) {
        for (const mw of options.middleware) {
          try {
            console.log(`[state-jet] Running middleware for ${key}`);

            const result = mw(key, stateValue, nextValue, set);

            if (result !== undefined) {
              if (result instanceof Promise) {
                const awaitedResult = await result;
                if (awaitedResult !== undefined) {
                  nextValue = awaitedResult as T;
                }
              } else {
                nextValue = result;
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

        if (options?.persist) {
          if (options?.encrypt) saveEncryptedState(key, nextValue);
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

  const set = (newValue: T | ((prev: T) => T) | Action<T>) => {
    pendingUpdates.set(key, newValue);
    if (globalObject?.requestAnimationFrame) {
      globalObject.requestAnimationFrame(batchUpdate);
    } else {
      setTimeout(batchUpdate, 0); // Fallback for environments without requestAnimationFrame
    }
  };

  return {
    useStore,
    set,
    undo,
    redo,
  };
};
