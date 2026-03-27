import { describe, it, expect, vi } from "vitest";
import { mergeCRDT, syncCRDT } from "./crdt";

describe("crdt", () => {
  it("should merge and sync", () => {
    const useState = vi.fn().mockReturnValue({ a: 1 });
    const set = vi.fn();
    syncCRDT({ b: 2 }, useState, set);
    expect(set).toHaveBeenCalledWith(expect.objectContaining({ a: 1, b: 2 }));
    expect(useState).toHaveBeenCalled();
  });

  it("should merge with lastUpdated", () => {
    const res = mergeCRDT({ a: 1 }, { b: 2 });
    expect(res).toHaveProperty("lastUpdated");
    expect(res.a).toBe(1);
    expect(res.b).toBe(2);
  });
});
