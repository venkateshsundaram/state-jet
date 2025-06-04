import { useRef } from "react";
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
  frameSync?: boolean; // Whether to sync updates with requestAnimationFrame
};
type StoreValue<T> = {
  value: T;
  listeners: Set<Listener>;
  middleware?: Middleware<T>[];
  persist?: boolean;
  encrypt?: boolean;
  frameSync?: boolean; // Whether to sync updates with requestAnimationFrame
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

    const fullKey = `${sliceName}:${key}`;

    if (!slice[key]) {
      let restoredValue = initialValue;
      if (options?.persist) {
        restoredValue = options?.encrypt
          ? (restoreEncryptedState(fullKey, initialValue) as T)
          : restoreState(fullKey, initialValue);
      }

      slice[key] = {
        value: restoredValue as T,
        listeners: new Set(),
        ...options,
      } as StoreValue<unknown>;
    }

    const state = slice[key];

    const undo = () => {
      if (history[fullKey]?.past.length) {
        history[fullKey].future.unshift(history[fullKey].present);
        history[fullKey].present = history[fullKey].past.pop()!;
        state.value = history[fullKey].present;
        state.listeners.forEach((listener) => listener());
        undoState(fullKey);
        notifyDevTools(`${sliceName}.undo`, history[fullKey].present);
      }
    };

    const redo = () => {
      if (history[fullKey]?.future.length) {
        history[fullKey].past.push(history[fullKey].present);
        history[fullKey].present = history[fullKey].future.shift()!;
        state.value = history[fullKey].present;
        state.listeners.forEach((listener) => listener());
        redoState(fullKey);
        notifyDevTools(`${sliceName}.redo`, history[fullKey].present);
      }
    };

    /**
     * Executes all pending updates in batch mode.
     */
    const batchUpdate = async <T>() => {
      updateScheduled = false;

      const updates = Array.from(pendingUpdates.entries()); // Convert Map to Array
      pendingUpdates.clear(); // Prevent infinite loops

      for (const [fullKey, newValue] of updates) {
        const [sliceNameFromKey, keyFromKey] = fullKey.split(":");
        const slice = store.get(sliceNameFromKey);
        if (!slice) continue;

        const state = slice[keyFromKey];
        if (!state) continue;

        if (activeMiddleware.has(fullKey)) {
          console.warn(`[state-jet] Skipping recursive middleware for: ${fullKey}`);
          continue;
        }

        let nextValue = newValue as T;
        const stateValue = state.value as T;

        if (!history[fullKey]) {
          history[fullKey] = { past: [], present: stateValue, future: [] };
        }
        history[fullKey].past.push(stateValue);
        history[fullKey].present = nextValue;
        history[fullKey].future = [];

        // ✅ Prevent recursive calls
        activeMiddleware.add(fullKey);

        if (state?.middleware) {
          for (const mw of state.middleware) {
            try {
              console.log(`[state-jet] Running middleware for ${fullKey}`);
              // Pass state through each middleware in sequence
              const result = mw(fullKey, stateValue, nextValue, (value: unknown) => {
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
              console.error(`[state-jet] Middleware error in ${fullKey}:`, error);
            }
          }
        }

        activeMiddleware.delete(fullKey);

        if (typeof nextValue === "function") {
          state.value = produce(state.value, nextValue as (draft: T) => T);
        } else if (stateValue !== nextValue) {
          state.value = nextValue;
          state.listeners.forEach((listener) => listener());
          notifyDevTools(`${sliceNameFromKey}.${keyFromKey}`, nextValue);
          measurePerformance(`${sliceNameFromKey}.${keyFromKey}`, () => {});

          if (state?.persist) {
            if (state?.encrypt) saveEncryptedState(fullKey, nextValue);
            else saveState(fullKey, nextValue);
          }
        }
      }
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
      notifyDevTools(`${sliceName}.clear`, initialValue);
    };

    const get = () => state.value as T;

    const set = async (newValue: T | ((prev: T) => T) | Action<T>, immediate: boolean = false) => {
      const currentValue = state.value as T;
      const nextValue =
        typeof newValue === "function" ? (newValue as (prev: T) => T)(currentValue) : newValue;

      // Directly set the next value in pendingUpdates to trigger immediate state update
      if (immediate) {
        state.value = nextValue as T;
        state.listeners.forEach((listener) => listener());
        notifyDevTools(`${sliceName}.${key}`, nextValue);
        return;
      }

      // Otherwise, queue the update for batch processing
      pendingUpdates.set(fullKey, nextValue);

      // Trigger batchUpdate for non-immediate updates
      if (!updateScheduled) {
        updateScheduled = true;
        if (state.frameSync && globalObject?.requestAnimationFrame) {
          await new Promise((resolve) =>
            globalObject.requestAnimationFrame(() => resolve(batchUpdate())),
          );
        } else {
          await batchUpdate();
        }
      }
    };

    return {
      useState,
      set,
      get,
      undo,
      redo,
      clear,
    };
  };
};

/**
 * Creates a store with multiple slices.
 */
export const useStore = <T extends Record<string, ReturnType<typeof useSlice>>>(
  initializer: () => T,
) => {
  // Store the initialized slices in a ref to persist them across renders
  const storeRef = useRef<T | null>(null);

  if (!storeRef.current) {
    storeRef.current = initializer();
  }

  return storeRef.current;
};
