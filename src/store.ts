import { useSyncExternalStore } from 'react';
import { produce } from "immer";
import { saveState, restoreState } from "./persistence";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";

type Listener = () => void;
type Middleware<T> = (key: string, prev: T, next: T) => T | void;

const store = new Map<string, { value: any; listeners: Set<Listener> }>();
const pendingUpdates = new Map();
const history: Record<string, { past: any[]; present: any; future: any[] }> = {};

export const useStateGlobal = <T>(
    key: string,
    initialValue?: T,
    options?: { middleware?: Middleware<T>[], persist?: boolean, encrypt?: boolean }
) => {
    if (!store.has(key)) {
        store.set(key, { value: initialValue, listeners: new Set() });
        if (options?.persist) restoreState(key);
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
            let nextValue = newValue;
            let stateValue = state.value;

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
                state.value = produce(state.value, nextValue);
            } else if (stateValue !== nextValue) {
                state.value = nextValue;
                state.listeners.forEach((listener) => listener());
                notifyDevTools(key, nextValue);
                measurePerformance(key, () => {});
                if (options?.persist) saveState(key, nextValue, options.encrypt);

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
            (callback) => {
                state.listeners.add(callback);
                return () => state.listeners.delete(callback);
            },
            () => state.value
        )
    };

    const set = (newValue: T) => {
        pendingUpdates.set(key, newValue);
        if (window?.requestAnimationFrame) window.requestAnimationFrame(batchUpdate);
    };

    return {
        useStore,
        set,
        undo,
        redo
    };
};