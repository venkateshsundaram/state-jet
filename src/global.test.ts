import { describe, it, expect } from "vitest";
import { getGlobalThis } from "./global";

describe("getGlobalThis", () => {
  it("should return scope if provided", () => {
    const scope = { a: 1 };
    expect(getGlobalThis(scope)).toBe(scope);
  });

  it("should return globalThis if scope is falsy", () => {
    expect(getGlobalThis()).toBe(globalThis);
    expect(getGlobalThis(undefined)).toBe(globalThis);
  });
});
