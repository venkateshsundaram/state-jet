import { useRef, useSyncExternalStore, useEffect } from "react";
import { produce } from "immer";
import { saveState, restoreState } from "./persistence";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";

type Listener = () => void;
export type Middleware<T> = (
  _key: string,
  _prev: T | undefined,
  _next: T | Action<T>,
  _set?: (_value: T) => void,
) => T | void | Promise<T | void>;

type Options<T> = {
  middleware?: Middleware<T | undefined>[];
  persist?: boolean;
  encrypt?: boolean;
  frameSync?: boolean;
};

type StoreValue<T> = {
  value: T;
  listeners: Set<Listener>;
  middleware?: Middleware<T>[];
  persist?: boolean;
  encrypt?: boolean;
  frameSync?: boolean;
  restored?: boolean;
};

type StoreSlice = Record<string, StoreValue<unknown>>;
type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export type Action<T> = { type: string; payload?: T };

export const store = new Map<string, StoreSlice>();
const pendingUpdates = new Map<string, unknown>();
const history: Record<string, HistoryState<unknown>> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hookCache = new Map<string, any>();
let updateScheduled = false;

async function batchUpdate() {
  while (pendingUpdates.size > 0) {
    const updates = Array.from(pendingUpdates.entries());
    pendingUpdates.clear();

    for (const [fullKey, newValue] of updates) {
      const [sliceName, key] = fullKey.split(":");
      const slice = store.get(sliceName);
      if (!slice) continue;
      const state = slice[key];
      if (!state) continue;

      let nextValue = newValue;
      const stateValue = state.value;

      if (!history[fullKey]) history[fullKey] = { past: [], present: stateValue, future: [] };
      history[fullKey].past.push(stateValue);
      history[fullKey].present = nextValue;
      history[fullKey].future = [];

      if (state.middleware) {
        for (const mw of state.middleware) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (mw as any)(fullKey, stateValue, nextValue, (val: any) => {
              nextValue = val;
            });
            if (result instanceof Promise) {
              const res = await result;
              if (res !== undefined) nextValue = res;
            } else if (result !== undefined) {
              nextValue = result;
            }
          } catch (err) {
            console.error(err);
          }
        }
      }

      state.value =
        typeof nextValue === "function"
          ? produce(
              state.value,
              nextValue as any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
            )
          : nextValue;
      for (const listener of state.listeners) listener();
      notifyDevTools(fullKey, state.value);
      measurePerformance(fullKey, () => {});

      if (state.persist) {
        if (state.encrypt) saveEncryptedState(fullKey, state.value);
        else saveState(fullKey, state.value);
      }
    }
  }
  updateScheduled = false;
}

export function clearGlobalState() {
  store.clear();
  hookCache.clear();
  for (const key of Object.keys(history)) delete history[key];
}

interface StoreHook<T> {
  useState: () => T;
  set: (val: T | ((prev: T) => T) | Action<T>, immediate?: boolean) => Promise<void>;
  get: () => T;
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

export function useSlice(sliceName: string) {
  if (!store.has(sliceName)) store.set(sliceName, {});

  return function sliceHookFactory<T>(
    key: string,
    initialValue: T,
    options?: Options<T | undefined>,
  ): StoreHook<T> {
    const slice = store.get(sliceName)!;
    const fullKey = `${sliceName}:${key}`;

    if (hookCache.has(fullKey)) return hookCache.get(fullKey);

    if (!slice[key]) {
      slice[key] = {
        value: initialValue as T,
        listeners: new Set(),
        ...options,
      } as StoreValue<unknown>;
    }

    const state = slice[key];
    const hook: StoreHook<T> = {
      useState: () => {
        useEffect(() => {
          if (state.persist && !state.restored) {
            state.restored = true;
            const res = state.encrypt
              ? restoreEncryptedState(fullKey, initialValue)
              : restoreState(fullKey, initialValue);
            if (res !== initialValue) {
              state.value = res;
              for (const l of state.listeners) l();
            }
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [initialValue]);
        return useSyncExternalStore(
          (cb) => {
            state.listeners.add(cb);
            return () => state.listeners.delete(cb);
          },
          () => state.value as T,
          () => initialValue as T,
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: async (val: any, immediate = false) => {
        if (immediate) {
          if (!history[fullKey]) history[fullKey] = { past: [], present: state.value, future: [] };
          history[fullKey].past.push(state.value);
          state.value = typeof val === "function" ? produce(state.value, val) : val;
          history[fullKey].present = state.value;
          history[fullKey].future = [];
          for (const l of state.listeners) l();
          notifyDevTools(fullKey, state.value);
          return;
        }
        pendingUpdates.set(fullKey, val);
        if (!updateScheduled) {
          updateScheduled = true;
          await batchUpdate();
        }
      },
      get: () => state.value as T,
      undo: () => {
        const h = history[fullKey];
        if (h && h.past.length) {
          h.future.unshift(h.present);
          h.present = h.past.pop()!;
          state.value = h.present;
          for (const l of state.listeners) l();
          undoState(fullKey);
          notifyDevTools(`${sliceName}.undo`, state.value);
        }
      },
      redo: () => {
        const h = history[fullKey];
        if (h && h.future.length) {
          h.past.push(h.present);
          h.present = h.future.shift()!;
          state.value = h.present;
          for (const l of state.listeners) l();
          redoState(fullKey);
          notifyDevTools(`${sliceName}.redo`, state.value);
        }
      },
      clear: () => {
        state.value = initialValue;
        for (const l of state.listeners) l();
        notifyDevTools(`${sliceName}.clear`, initialValue);
      },
    };

    hookCache.set(fullKey, hook);
    return hook;
  };
}

export function useStateGlobal<T>(key: string, initialValue: T, options?: Options<T>): StoreHook<T>;
export function useStateGlobal<T>(
  key: string,
  initialValue?: T,
  options?: Options<T>,
): StoreHook<T | undefined>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStateGlobal(key: string, initialValue?: any, options?: any): any {
  return useSlice("global")(key, initialValue, options);
}

export function useStore<T extends Record<string, unknown>>(initializer: () => T) {
  const ref = useRef<T | null>(null);
  if (!ref.current) ref.current = initializer();
  return ref.current;
}
