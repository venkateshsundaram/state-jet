import { globalObject } from "./global";

const encrypt = <T>(data: T) => btoa(JSON.stringify(data));
const decrypt = <T>(data: string): T => JSON.parse(atob(data));

export const saveEncryptedState = <T>(key: string, value: T) => {
  if (typeof globalObject?.localStorage !== "undefined") {
    globalObject.localStorage.setItem(key, encrypt(value));
  }
};

export const restoreEncryptedState = <T>(key: string, defaultValue?: T) => {
  if (typeof globalObject?.localStorage !== "undefined") {
    const data = globalObject.localStorage?.getItem(key);
    return data ? decrypt(data) : defaultValue;
  }
  return defaultValue;
};
