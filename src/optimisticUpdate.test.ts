import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { optimisticUpdate } from "./optimistic";

describe("optimisticUpdate", () => {
  let mockSet: Mock;
  let mockUseStore: Mock;
  let setState: { set: (value: any) => void; useStore: () => any };

  beforeEach(() => {
    mockSet = vi.fn();
    mockUseStore = vi.fn();
    setState = {
      set: mockSet,
      useStore: mockUseStore,
    };
  });

  it("should apply optimistic update and call API", async () => {
    const prevState = { count: 0 };
    const optimisticState = { count: 1 };
    const apiResponse = { count: 2 };

    mockUseStore.mockReturnValue(prevState);
    const updateFn = (state: typeof prevState) => ({ ...state, ...optimisticState });
    const apiCall = vi.fn().mockResolvedValue(apiResponse);

    await optimisticUpdate(setState, updateFn, apiCall);

    expect(mockSet).toHaveBeenCalledWith(optimisticState);
    expect(apiCall).toHaveBeenCalled();
  });

  it("should rollback to previous state if API call fails", async () => {
    const prevState = { count: 0 };
    const optimisticState = { count: 1 };

    mockUseStore.mockReturnValue(prevState);
    const updateFn = (state: typeof prevState) => ({ ...state, ...optimisticState });
    const apiCall = vi.fn().mockRejectedValue(new Error("API error"));

    await optimisticUpdate(setState, updateFn, apiCall);

    expect(mockSet).toHaveBeenCalledWith(optimisticState);
    expect(mockSet).toHaveBeenCalledWith(prevState);
  });

  it("should use rollback function if provided and API call fails", async () => {
    const prevState = { count: 0 };
    const optimisticState = { count: 1 };
    const rollbackState = { count: -1 };

    mockUseStore.mockReturnValue(prevState);
    const updateFn = (state: typeof prevState) => ({ ...state, ...optimisticState });
    const apiCall = vi.fn().mockRejectedValue(new Error("API error"));
    const rollbackFn = (state: typeof prevState) => ({ ...state, ...rollbackState });

    await optimisticUpdate(setState, updateFn, apiCall, rollbackFn);

    expect(mockSet).toHaveBeenCalledWith(optimisticState);
    expect(mockSet).toHaveBeenCalledWith(rollbackState);
  });

  it("should handle empty initial state", async () => {
    const prevState = {};
    const optimisticState = { count: 1 };
    const apiResponse = { count: 2 };

    mockUseStore.mockReturnValue(prevState);
    const updateFn = (state: typeof prevState) => ({ ...state, ...optimisticState });
    const apiCall = vi.fn().mockResolvedValue(apiResponse);

    await optimisticUpdate(setState, updateFn, apiCall);

    expect(mockSet).toHaveBeenCalledWith(optimisticState);
    expect(apiCall).toHaveBeenCalled();
  });

  it("should handle empty optimistic state", async () => {
    const prevState = { count: 0 };
    const optimisticState = {};
    const apiResponse = { count: 2 };

    mockUseStore.mockReturnValue(prevState);
    const updateFn = () => optimisticState;
    const apiCall = vi.fn().mockResolvedValue(apiResponse);

    await optimisticUpdate(setState, updateFn, apiCall);

    expect(mockSet).toHaveBeenCalledWith(optimisticState);
    expect(apiCall).toHaveBeenCalled();
  });

  it("should handle empty rollback state", async () => {
    const prevState = { count: 0 };
    const optimisticState = { count: 1 };
    const rollbackState = {};

    mockUseStore.mockReturnValue(prevState);
    const updateFn = () => optimisticState;
    const apiCall = vi.fn().mockRejectedValue(new Error("API error"));
    const rollbackFn = () => rollbackState;

    await optimisticUpdate(setState, updateFn, apiCall, rollbackFn);

    expect(mockSet).toHaveBeenCalledWith(optimisticState);
    expect(mockSet).toHaveBeenCalledWith(rollbackState);
  });

  it("should log an error if API call fails", async () => {
    const prevState = { count: 0 };
    const optimisticState = { count: 1 };
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockUseStore.mockReturnValue(prevState);
    const updateFn = (state: typeof prevState) => ({ ...state, ...optimisticState });
    const apiCall = vi.fn().mockRejectedValue(new Error("API error"));

    await optimisticUpdate(setState, updateFn, apiCall);

    expect(consoleErrorSpy).toHaveBeenCalledWith("API request failed:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
