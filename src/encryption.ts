import { globalObject } from "./global";

const encrypt = (data: any) => btoa(JSON.stringify(data));
const decrypt = (data: any) => JSON.parse(atob(data));

export const saveEncryptedState = (key: string, value: any) => {
  if (typeof globalObject !== "undefined") {
    globalObject.localStorage.setItem(key, encrypt(value));
  }
};

export const restoreEncryptedState = (key: string, defaultValue?: any) => {
  if (typeof globalObject !== "undefined") {
    const data = globalObject.localStorage.getItem(key);
    return data ? decrypt(data) : defaultValue;
  }

  return defaultValue;
};
