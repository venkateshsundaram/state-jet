import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { globalObject } from "./global";

// Mock globalObject
const mockLocalStorage = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  length: 0,
  clear: vi.fn(),
  key: vi.fn(),
  removeItem: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  globalObject.localStorage = mockLocalStorage;
});

describe("saveEncryptedState", () => {
  it("should save encrypted state to localStorage", () => {
    const key = "testKey";
    const value = { foo: "bar" };

    saveEncryptedState(key, value);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(key, btoa(JSON.stringify(value)));
  });
});

describe("restoreEncryptedState", () => {
  it("should restore encrypted state from localStorage", () => {
    const key = "testKey";
    const value = { foo: "bar" };
    mockLocalStorage.getItem.mockReturnValue(btoa(JSON.stringify(value)));

    const result = restoreEncryptedState(key);

    expect(result).toEqual(value);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
  });

  it("should return default value if key does not exist in localStorage", () => {
    const key = "testKey";
    const defaultValue = { foo: "default" };
    mockLocalStorage.getItem.mockReturnValue(null);

    const result = restoreEncryptedState(key, defaultValue);

    expect(result).toEqual(defaultValue);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
  });

  it("should return default value if globalObject is undefined", () => {
    const key = "testKey";
    const defaultValue = { foo: "default" };

    const originalGlobalObject = { ...globalObject };
    (globalObject as any).localStorage = undefined;

    const result = restoreEncryptedState(key, defaultValue);

    expect(result).toEqual(defaultValue);

    (globalObject as any).localStorage = originalGlobalObject.localStorage;
  });

  it("should return undefined if key does not exist and no default value is provided", () => {
    const key = "testKey";
    mockLocalStorage.getItem.mockReturnValue(null);

    const result = restoreEncryptedState(key);

    expect(result).toBeUndefined();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
  });

  it("should throw an error if the stored data is not valid JSON", () => {
    const key = "testKey";
    mockLocalStorage.getItem.mockReturnValue("invalid data");

    expect(() => restoreEncryptedState(key)).toThrow();
  });
});
