

const stateHistory: { [key: string]: any[] } = {};
const stateIndex: { [key: string]: number } = {};
const performanceData: { [key: string]: number[] } = {};
const devtoolsEnabled = typeof window !== "undefined" && (window as any).__STATE_JET_DEVTOOLS__;

export const notifyDevTools = (key: string, value: any) => {
  if (!stateHistory[key]) stateHistory[key] = [];
  if (stateIndex[key] === undefined) stateIndex[key] = -1;

  // Remove future states when a new state is set
  stateHistory[key] = stateHistory[key].slice(0, stateIndex[key] + 1);
  
  stateHistory[key].push(value);
  stateIndex[key]++;

  if (devtoolsEnabled && (window as any).__STATE_JET_DEVTOOLS__.updateState) {
    (window as any).__STATE_JET_DEVTOOLS__.updateState(key, value, stateHistory[key]);
 }
};

export const measurePerformance = (key: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const duration = performance.now() - start;

  if (!performanceData[key]) performanceData[key] = [];
  performanceData[key].push(duration);

  if (devtoolsEnabled && (window as any).__STATE_JET_DEVTOOLS__.updatePerformance) {
    (window as any).__STATE_JET_DEVTOOLS__.updatePerformance(key, duration);
  }
};

export const undoState = (key: string) => {
  if (stateIndex[key] > 0) {
    stateIndex[key]--;
    return stateHistory[key][stateIndex[key]];
  }
};

export const redoState = (key: string) => {
  if (stateIndex[key] < stateHistory[key].length - 1) {
    stateIndex[key]++;
    return stateHistory[key][stateIndex[key]];
  }
};
