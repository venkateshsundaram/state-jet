import { globalObject } from "./global";

type StateHistory<T> = Record<string, T[]>;
type StateIndex = Record<string, number>;
type PerformanceData = Record<string, number[]>;

const stateHistory: StateHistory<unknown> = {};
const stateIndex: StateIndex = {};
const performanceData: PerformanceData = {};

interface GlobalObject extends Window {
  __STATE_JET_DEVTOOLS__?: {
    updateState?: (key: string, value: unknown, stateHistory: unknown[]) => void;
    updatePerformance?: (key: string, duration: number) => void;
  };
}

const devtools = (globalObject as unknown as GlobalObject).__STATE_JET_DEVTOOLS__;

export const notifyDevTools = <T>(key: string, value: T) => {
  if (!stateHistory[key]) stateHistory[key] = [];
  if (stateIndex[key] === undefined) stateIndex[key] = -1;

  // Remove future states when a new state is set
  stateHistory[key] = stateHistory[key].slice(0, stateIndex[key] + 1);

  stateHistory[key].push(value);
  stateIndex[key]++;

  if (devtools?.updateState) {
    devtools.updateState(key, value, [...stateHistory[key]]);
  }
};

export const measurePerformance = (key: string, callback: () => void) => {
  if (!performanceData[key]) performanceData[key] = [];
  const start = performance.now();
  callback();
  const duration = performance.now() - start;

  performanceData[key].push(duration);

  if (devtools?.updatePerformance) {
    devtools.updatePerformance(key, duration);
  }
};

export const undoState = <T>(key: string): T | undefined => {
  if (stateIndex[key] > 0) {
    stateIndex[key]--;
    return stateHistory[key][stateIndex[key]] as T;
  }
};

export const redoState = <T>(key: string): T | undefined => {
  if (stateIndex[key] < stateHistory[key]?.length - 1) {
    stateIndex[key]++;
    return stateHistory[key][stateIndex[key]] as T;
  }
};
