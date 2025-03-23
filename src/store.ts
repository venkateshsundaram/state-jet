import { produce } from "immer";
import { saveState, restoreState } from "./persistence";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";
import { globalObject } from "./global";

type Listener = () => void;
type Middleware<T> = (
  key: string,
  prev: T | undefined,
  next: T | Action<T>,
  set?: (value: T) => void,
) => T | void | Promise<void>;
type Options<T> = {
  middleware?: Middleware<T | undefined>[];
  persist?: boolean;
  encrypt?: boolean;
};
type StoreValue<T> = {
  value: T;
  listeners: Set<Listener>;
  middleware?: Middleware<T>[];
  persist?: boolean;
  encrypt?: boolean;
};
type StoreSlice = Record<string, StoreValue<unknown>>;
type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};
type Action<T> = { type: string; payload?: T };

const activeMiddleware = new Set<string>();
const store = new Map<string, StoreSlice>(); // Multi-slice store
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
export const useStateGlobal = <T>(key: string, initialValue?: T, options?: Options<T>) => {
  return useSlice("global")(key, initialValue, options as Options<T | undefined>);
};

/**
 * Creates a slice that can hold multiple state values.
 */
export const useSlice = (sliceName: string) => {
  if (!store.has(sliceName)) {
    store.set(sliceName, {});
  }

  return <T>(key: string, initialValue: T, options?: Options<T | undefined>) => {
    const slice = store.get(sliceName)!;

    if (!slice[key]) {
      let restoredValue = initialValue;
      if (options?.persist) {
        restoredValue = options?.encrypt
          ? (restoreEncryptedState(`${sliceName}:${key}`, initialValue) as T)
          : restoreState(`${sliceName}:${key}`, initialValue);
      }
      slice[key] = {
        value: restoredValue as T,
        listeners: new Set(),
        ...options,
      } as StoreValue<unknown>;
    }

    const state = slice[key];

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

      for (const [updatesKey, newValue] of updates) {
        const state = slice[key];

        if (activeMiddleware.has(updatesKey)) {
          console.warn(`[state-jet] Skipping recursive middleware call for: ${updatesKey}`);
          continue; // Prevent recursive execution
        }

        let nextValue = newValue as unknown as T;
        const stateValue = state.value as T;

        if (!history[updatesKey]) {
          history[updatesKey] = { past: [], present: stateValue, future: [] };
        }
        history[updatesKey].past.push(stateValue);
        history[updatesKey].present = nextValue;
        history[updatesKey].future = [];

        // ✅ Prevent recursive calls
        activeMiddleware.add(updatesKey);

        if (state?.middleware) {
          for (const mw of state.middleware) {
            try {
              console.log(`[state-jet] Running middleware for ${updatesKey}`);

              // Pass state through each middleware in sequence
              const result = mw(updatesKey, stateValue, nextValue, (value: unknown) => {
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
              console.error(`[state-jet] Middleware error in ${updatesKey}:`, error);
            }
          }
        }

        activeMiddleware.delete(updatesKey); // ✅ Allow future updates for this key

        if (typeof nextValue === "function") {
          state.value = produce(state.value, nextValue as (draft: T) => T);
        } else if (stateValue !== nextValue) {
          state.value = nextValue;
          state.listeners.forEach((listener) => listener());
          notifyDevTools(`${sliceName}.${updatesKey}`, nextValue);
          measurePerformance(`${sliceName}.${updatesKey}`, () => {});

          if (state?.persist) {
            if (state?.encrypt) saveEncryptedState(`${sliceName}:${updatesKey}`, nextValue);
            else saveState(`${sliceName}:${updatesKey}`, nextValue);
          }
        }
      }
      pendingUpdates.clear();
    };

    const useState = () => {
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
      useState,
      set,
      undo,
      redo,
      clear,
    };
  };
};

/**
 * Creates a store with multiple slices.
 */
export const useStore = <T extends Record<string, unknown>>() => {
  return <S extends (store: T) => void>(initializer: S) => {
    const combinedStore: T = {} as T;
    initializer(combinedStore);
    return combinedStore;
  };
};
