import { describe, it, expect, beforeEach, vi } from "vitest";
import { derivedState } from "./derived";

// Mock dependencies
const mockUseStore1 = vi.fn();
const mockUseStore2 = vi.fn();
const mockUseStore3 = vi.fn();

const dependency1 = { useStore: mockUseStore1 };
const dependency2 = { useStore: mockUseStore2 };
const dependency3 = { useStore: mockUseStore3 };

describe("derivedState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should compute derived state with single dependency", () => {
    mockUseStore1.mockReturnValue(10);
    const computeFn = (value1: number) => value1 * 2;
    const derived = derivedState([dependency1], computeFn);

    expect(derived()).toBe(20);
    expect(mockUseStore1).toHaveBeenCalledTimes(1);
  });

  it("should compute derived state with multiple dependencies", () => {
    mockUseStore1.mockReturnValue(10);
    mockUseStore2.mockReturnValue(20);
    const computeFn = (value1: number, value2: number) => value1 + value2;
    const derived = derivedState([dependency1, dependency2], computeFn);

    expect(derived()).toBe(30);
    expect(mockUseStore1).toHaveBeenCalledTimes(1);
    expect(mockUseStore2).toHaveBeenCalledTimes(1);
  });

  it("should handle no dependencies", () => {
    const computeFn = () => 42;
    const derived = derivedState([], computeFn);

    expect(derived()).toBe(42);
  });

  it("should handle dependencies returning different types", () => {
    mockUseStore1.mockReturnValue(10);
    mockUseStore2.mockReturnValue("hello");
    const computeFn = (value1: number, value2: string) => `${value2} ${value1}`;
    const derived = derivedState([dependency1, dependency2], computeFn);

    expect(derived()).toBe("hello 10");
    expect(mockUseStore1).toHaveBeenCalledTimes(1);
    expect(mockUseStore2).toHaveBeenCalledTimes(1);
  });

  it("should handle edge case with undefined values", () => {
    mockUseStore1.mockReturnValue(undefined);
    const computeFn = (value1: any) => value1 ?? "default";
    const derived = derivedState([dependency1], computeFn);

    expect(derived()).toBe("default");
    expect(mockUseStore1).toHaveBeenCalledTimes(1);
  });

  it("should handle edge case with null values", () => {
    mockUseStore1.mockReturnValue(null);
    const computeFn = (value1: any) => value1 ?? "default";
    const derived = derivedState([dependency1], computeFn);

    expect(derived()).toBe("default");
    expect(mockUseStore1).toHaveBeenCalledTimes(1);
  });

  it("should handle complex compute function", () => {
    mockUseStore1.mockReturnValue(5);
    mockUseStore2.mockReturnValue(3);
    mockUseStore3.mockReturnValue(2);
    const computeFn = (a: number, b: number, c: number) => a * b + c;
    const derived = derivedState([dependency1, dependency2, dependency3], computeFn);

    expect(derived()).toBe(17);
    expect(mockUseStore1).toHaveBeenCalledTimes(1);
    expect(mockUseStore2).toHaveBeenCalledTimes(1);
    expect(mockUseStore3).toHaveBeenCalledTimes(1);
  });
});
