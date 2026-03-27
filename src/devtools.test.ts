import { describe, it, expect, vi, afterEach } from "vitest";
import { notifyDevTools, measurePerformance, undoState, redoState } from "./devtools";
import { globalObject } from "./global";

interface GlobalObject extends Window {
  __STATE_JET_DEVTOOLS__?: {
    updateState?: (key: string, value: unknown, stateHistory: unknown[]) => void;
    updatePerformance?: (key: string, duration: number) => void;
  };
}

vi.mock("./global", () => ({
  globalObject: {
    __STATE_JET_DEVTOOLS__: {
      updateState: vi.fn(),
      updatePerformance: vi.fn(),
    },
  },
}));

describe("State Manager Functions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ✅ Test notifyDevTools calls updateState
  it("should add new state to history and notify devtools", () => {
    notifyDevTools("testKey", 42);

    expect(
      (globalObject as unknown as GlobalObject).__STATE_JET_DEVTOOLS__?.updateState,
    ).toHaveBeenCalledTimes(1);
    expect(
      (globalObject as unknown as GlobalObject).__STATE_JET_DEVTOOLS__?.updateState,
    ).toHaveBeenCalledWith("testKey", 42, [42]);
  });

  // ✅ Test measurePerformance calls updatePerformance
  it("should measure callback execution time and notify devtools", () => {
    const mockCallback = vi.fn(() => {
      for (let i = 0; i < 1e6; i++); // Simulated delay
    });

    measurePerformance("performanceTest", mockCallback);

    expect(mockCallback).toHaveBeenCalled();
    expect(
      (globalObject as unknown as GlobalObject).__STATE_JET_DEVTOOLS__?.updatePerformance,
    ).toHaveBeenCalledTimes(1);
  });

  // ✅ Test undoState
  it("should undo the last state change", () => {
    notifyDevTools("counter", 10);
    notifyDevTools("counter", 20);
    notifyDevTools("counter", 30);

    expect(undoState<number>("counter")).toBe(20);
    expect(undoState<number>("counter")).toBe(10);
  });

  // ✅ Test redoState
  it("should redo the last undone state", () => {
    notifyDevTools("counter", 10);
    notifyDevTools("counter", 20);
    notifyDevTools("counter", 30);

    undoState("counter");
    undoState("counter");

    expect(redoState<number>("counter")).toBe(20);
    expect(redoState<number>("counter")).toBe(30);
  });

  // ✅ Test undoState when there's no previous state
  it("should return undefined if there's no previous state to undo", () => {
    expect(undoState("emptyState")).toBeUndefined();
  });

  it("should return undefined if there's no future state to redo", () => {
    expect(redoState("emptyState")).toBeUndefined();
  });

  // ✅ New branch coverage: DevTools extension is present
  it("should notify devtools when updateState is present", () => {
    const mockUpdate = vi.fn();
    // Temporarily replace the devtools object
    (globalObject as any).__STATE_JET_DEVTOOLS__.updateState = mockUpdate;

    notifyDevTools("branchKey", 100);

    expect(mockUpdate).toHaveBeenCalledWith("branchKey", 100, [100]);

    // Test performance update as well
    const mockPerf = vi.fn();
    (globalObject as any).__STATE_JET_DEVTOOLS__.updatePerformance = mockPerf;

    measurePerformance("perfKey", () => {});
    expect(mockPerf).toHaveBeenCalled();
  });

  it("should handle existing performanceData key", () => {
    measurePerformance("existingKey", () => {});
    measurePerformance("existingKey", () => {}); // Second call hits the branch where performanceData[key] exists
  });
});
