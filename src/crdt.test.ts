import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { mergeCRDT, syncCRDT } from "./crdt";

describe("mergeCRDT", () => {
  it("should overwrite local state with remote state", () => {
    const localState = { a: 1, b: 2 };
    const remoteState = { b: 3, c: 4 } as unknown as { a: number; b: number };
    const result = mergeCRDT(localState, remoteState);

    expect(result.b).toBe(3);
  });

  it("should add new properties from remote state to local state", () => {
    const localState = { a: 1 };
    const remoteState = { b: 2 } as unknown as { a: number; b: number };
    const result = mergeCRDT(localState, remoteState);

    expect(result).toEqual({
      a: 1,
      b: 2,
      lastUpdated: expect.any(Number),
    });
  });
});

describe("syncCRDT", () => {
  let mockUseStore: Mock;
  let mockSet: Mock;
  let setState: { useState: () => any; set: (state: any) => void };

  beforeEach(() => {
    mockUseStore = vi.fn();
    mockSet = vi.fn();
    setState = {
      useState: mockUseStore,
      set: mockSet,
    };
  });

  it("should merge local and remote states and set the new state", () => {
    const localState = { a: 1, b: 2 };
    const remoteState = { b: 3, c: 4 };
    mockUseStore.mockReturnValue(localState);

    syncCRDT(remoteState, setState);

    expect(mockSet).toHaveBeenCalledWith({
      a: 1,
      b: 3,
      c: 4,
      lastUpdated: expect.any(Number),
    });
  });

  it("should call useState to get the local state", () => {
    const remoteState = { b: 3, c: 4 };
    mockUseStore.mockReturnValue({ a: 1, b: 2 });

    syncCRDT(remoteState, setState);

    expect(mockUseStore).toHaveBeenCalled();
  });

  it("should handle empty local state", () => {
    const localState = {};
    const remoteState = { b: 3, c: 4 };
    mockUseStore.mockReturnValue(localState);

    syncCRDT(remoteState, setState);

    expect(mockSet).toHaveBeenCalledWith({
      b: 3,
      c: 4,
      lastUpdated: expect.any(Number),
    });
  });

  it("should handle empty remote state", () => {
    const localState = { a: 1, b: 2 };
    const remoteState = {};
    mockUseStore.mockReturnValue(localState);

    syncCRDT(remoteState, setState);

    expect(mockSet).toHaveBeenCalledWith({
      a: 1,
      b: 2,
      lastUpdated: expect.any(Number),
    });
  });

  it("should handle both local and remote states being empty", () => {
    const localState = {};
    const remoteState = {};
    mockUseStore.mockReturnValue(localState);

    syncCRDT(remoteState, setState);

    expect(mockSet).toHaveBeenCalledWith({
      lastUpdated: expect.any(Number),
    });
  });
});
