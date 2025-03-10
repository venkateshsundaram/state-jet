import { globalObject } from "./global";

export const saveState = <T>(key: string, value: T) => {
  if (typeof globalObject?.localStorage !== "undefined") {
    globalObject.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const restoreState = <T>(key: string, defaultValue?: T) => {
  if (typeof globalObject?.localStorage !== "undefined") {
    const savedData = globalObject.localStorage?.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  }
  return defaultValue;
};
