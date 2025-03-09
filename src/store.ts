import { produce } from "immer";
import { saveState, restoreState } from "./persistence";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";

import { useSyncExternalStore } from "use-sync-external-store/shim";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";
import { globalObject } from "./global";

type Listener = () => void;
type Middleware<T> = (key: string, prev: T, next: T) => T | void;
type StoreValue<T> = {
  value: T;
  listeners: Set<Listener>;
};
type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};
const store = new Map<string, StoreValue<unknown>>();
const pendingUpdates = new Map();
const history: Record<string, HistoryState<unknown>> = {};

export const useStateGlobal = <T>(
  key: string,
  initialValue?: T,
  options?: { middleware?: Middleware<T>[]; persist?: boolean; encrypt?: boolean },
) => {
  if (!store.has(key)) {
    store.set(key, { value: initialValue, listeners: new Set() });
    if (options?.persist) {
      if (options?.encrypt) restoreEncryptedState(key, initialValue);
      else restoreState(key, initialValue);
    }
  }
  const state = store.get(key)!;
  const undo = () => {
    if (history[key]?.past.length) {
      history[key].future.unshift(history[key].present);
      history[key].present = history[key].past.pop();
      state.value = history[key].present;
      state.listeners.forEach((listener) => listener());
      undoState(key);
    }
  };

  const batchUpdate = () => {
    pendingUpdates.forEach((newValue, key) => {
      let nextValue = newValue as T;
      const stateValue = state.value as T;

      if (!history[key]) {
        history[key] = { past: [], present: stateValue, future: [] };
      }
      history[key].past.push(stateValue);
      history[key].present = newValue;
      history[key].future = [];
      options?.middleware?.forEach((mw) => {
        const result = mw(key, stateValue, nextValue);
        if (result !== undefined) nextValue = result;
      });
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
    });
    pendingUpdates.clear();
  };

  const redo = () => {
    if (history[key]?.future.length) {
      history[key].past.push(history[key].present);
      history[key].present = history[key].future.shift();
      state.value = history[key].present;
      state.listeners.forEach((listener) => listener());
      redoState(key);
    }
  };

  const useStore = () => {
    return useSyncExternalStore(
      (callback: () => void) => {
        state.listeners.add(callback);
        return () => state.listeners.delete(callback);
      },
      () => state.value,
    );
  };

  const set = (newValue: T) => {
    pendingUpdates.set(key, newValue);
    if (globalObject?.requestAnimationFrame) globalObject.requestAnimationFrame(batchUpdate);
  };

  return {
    useStore,
    set,
    undo,
    redo,
  };
};
