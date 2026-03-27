import { describe, it, expect, vi } from "vitest";

describe("persistence and encryption without localStorage", () => {
  it("saveState should not throw if localStorage is undefined", async () => {
    vi.resetModules();
    vi.doMock("./global", () => ({ globalObject: {} }));
    const { saveState } = await import("./persistence");
    expect(() => saveState("key", "val")).not.toThrow();
  });

  it("restoreState should return defaultValue if localStorage is undefined", async () => {
    vi.resetModules();
    vi.doMock("./global", () => ({ globalObject: {} }));
    const { restoreState } = await import("./persistence");
    expect(restoreState("key", "default")).toBe("default");
  });

  it("saveEncryptedState should not throw if localStorage is undefined", async () => {
    vi.resetModules();
    vi.doMock("./global", () => ({ globalObject: {} }));
    const { saveEncryptedState } = await import("./encryption");
    expect(() => saveEncryptedState("key", "val")).not.toThrow();
  });

  it("restoreEncryptedState should return defaultValue if localStorage is undefined", async () => {
    vi.resetModules();
    vi.doMock("./global", () => ({ globalObject: {} }));
    const { restoreEncryptedState } = await import("./encryption");
    expect(restoreEncryptedState("key", "default")).toBe("default");
  });
});
