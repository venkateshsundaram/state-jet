type StateHistory<T> = Record<string, T[]>;
type StateIndex = Record<string, number>;
type PerformanceData = Record<string, number[]>;

const stateHistory: StateHistory<unknown> = {};
const stateIndex: StateIndex = {};
const performanceData: PerformanceData = {};

declare global {
  interface Window {
    __STATE_JET_DEVTOOLS__?: {
      updateState?: (key: string, value: unknown, history: unknown[]) => void;
      updatePerformance?: (key: string, duration: number) => void;
    };
  }
}

const devtoolsEnabled = typeof window !== "undefined" && window.__STATE_JET_DEVTOOLS__;

export const notifyDevTools = <T>(key: string, value: T) => {
  if (!stateHistory[key]) stateHistory[key] = [];
  if (stateIndex[key] === undefined) stateIndex[key] = -1;

  // Remove future states when a new state is set
  stateHistory[key] = stateHistory[key].slice(0, stateIndex[key] + 1);

  stateHistory[key].push(value);
  stateIndex[key]++;

  if (devtoolsEnabled && window.__STATE_JET_DEVTOOLS__?.updateState) {
    window.__STATE_JET_DEVTOOLS__.updateState(key, value, stateHistory[key]);
  }
};

export const measurePerformance = (key: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const duration = performance.now() - start;

  if (!performanceData[key]) performanceData[key] = [];
  performanceData[key].push(duration);

  if (devtoolsEnabled && window.__STATE_JET_DEVTOOLS__?.updatePerformance) {
    window.__STATE_JET_DEVTOOLS__.updatePerformance(key, duration);
  }
};

export const undoState = <T>(key: string): T | undefined => {
  if (stateIndex[key] > 0) {
    stateIndex[key]--;
    return stateHistory[key][stateIndex[key]] as T;
  }
};

export const redoState = <T>(key: string): T | undefined => {
  if (stateIndex[key] < stateHistory[key].length - 1) {
    stateIndex[key]++;
    return stateHistory[key][stateIndex[key]] as T;
  }
};
