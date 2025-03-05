import { globalObject } from "./global";

export const saveState = (key: string, value: any) => {
    if (typeof globalObject !== "undefined") {
        globalObject.localStorage.setItem(key, JSON.stringify(value));
    }
};

export const restoreState = (key: string, defaultValue?: any) => {
    if (typeof globalObject !== "undefined") {
        const savedData = globalObject.localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : defaultValue;
    }
    return defaultValue;
};
