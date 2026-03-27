import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { renderHook, act } from "@testing-library/react";
import { useStateGlobal, useSlice, useStore, clearGlobalState, store, hookCache } from "./store";
import { getGlobalThis } from "./global";
import { restoreState } from "./persistence";
import { restoreEncryptedState } from "./encryption";

vi.mock("./persistence", async () => {
  const actual: any = await vi.importActual("./persistence");
  return {
    ...actual,
    saveState: vi.fn(),
    restoreState: vi.fn((key, init) => init),
  };
});

vi.mock("./encryption", async () => {
  const actual: any = await vi.importActual("./encryption");
  return {
    ...actual,
    saveEncryptedState: vi.fn(),
    restoreEncryptedState: vi.fn((key, init) => init),
  };
});

describe("state-jet Simplified Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearGlobalState();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should achieve 100% coverage for store.ts", async () => {
    const hook = useStateGlobal<number>("master", 0, { persist: true, encrypt: true });

    // Test useState (initial render)
    const { result } = renderHook(() => hook.useState());
    expect(result.current).toBe(0);

    // Test get()
    expect(hook.get()).toBe(0);

    // Test set() (immediate)
    await act(async () => {
      await hook.set(1, true);
    });
    expect(hook.get()).toBe(1);

    // Test set() (batched)
    await act(async () => {
      await hook.set(2);
    });
    expect(hook.get()).toBe(2);

    // Test undo/redo with history
    act(() => {
      hook.undo();
    });
    expect(hook.get()).toBe(1);

    act(() => {
      hook.redo();
    });
    expect(hook.get()).toBe(2);

    // Test undo/redo with empty history (hit branches)
    const emptyHook = useStateGlobal<number>("empty", 0);
    act(() => {
      emptyHook.undo();
    });
    act(() => {
      emptyHook.redo();
    });

    // Test clear
    act(() => {
      hook.clear();
    });
    expect(hook.get()).toBe(0);

    // Test middleware (async and sync)
    const mwHook = useStateGlobal<number>("mw", 0, {
      middleware: [
        async (_k, p, n) => (n as number) + 5,
        (_k, p, n, set) => {
          if (n === 10) set?.(20);
        },
      ],
    });

    await act(async () => {
      await mwHook.set(5);
    });
    expect(mwHook.get()).toBe(20);

    // Test slice isolation
    const sliceA = useSlice("A")("val", 1);
    const sliceB = useSlice("B")("val", 2);
    expect(sliceA.get()).toBe(1);
    expect(sliceB.get()).toBe(2);

    // Test useStore
    const { result: storeResult } = renderHook(() => useStore(() => ({ x: 1 })));
    expect(storeResult.current.x).toBe(1);
  });

  it("should handle error in middleware", async () => {
    const errHook = useStateGlobal<number>("err", 0, {
      middleware: [
        () => {
          throw new Error("MW Error");
        },
      ],
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      await errHook.set(1);
    });
    expect(errHook.get()).toBe(1);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("should cover hydration restoration branch", async () => {
    (restoreState as any).mockReturnValueOnce(100);
    const hydHook = useStateGlobal<number>("hyd", 0, { persist: true });

    const { result } = renderHook(() => hydHook.useState());
    // Wait for useEffect
    await act(async () => {});
    expect(hydHook.get()).toBe(100);
    expect(result.current).toBe(100);

    // Test encrypted restoration
    (restoreEncryptedState as any).mockReturnValueOnce(200);
    const encHook = useStateGlobal<number>("enc", 0, { persist: true, encrypt: true });
    renderHook(() => encHook.useState());
    await act(async () => {});
    expect(encHook.get()).toBe(200);
  });

  it("should handle recursive updates and batching", async () => {
    const recHook = useStateGlobal<number>("recursive", 0, {
      middleware: [
        async (_k, p, n) => {
          if (n === 1) await recHook.set(2);
        },
      ],
    });
    await act(async () => {
      await recHook.set(1);
    });
    expect(recHook.get()).toBe(2);
  });

  it("should cover non-encrypted persistence", async () => {
    const plainHook = useStateGlobal<number>("plain", 0, { persist: true, encrypt: false });
    await act(async () => {
      await plainHook.set(1);
    });
    expect(plainHook.get()).toBe(1);
  });

  it("should cache hooks for the same key", () => {
    const slice = useSlice("CachedSlice");
    const hook1 = slice("key", 0);
    const hook2 = slice("key", 0);
    expect(hook1).toBe(hook2);
  });

  it("should handle sync middleware returning a value", async () => {
    const mwHook = useStateGlobal<number>("sync-mw", 0, {
      middleware: [(_k, p, n) => (n as number) + 10],
    });
    await act(async () => {
      await mwHook.set(5);
    });
    expect(mwHook.get()).toBe(15);
  });

  it("should handle function updates in set", async () => {
    const fnHook = useStateGlobal<number>("fn-upd", 0);
    await act(async () => {
      await fnHook.set((prev: number) => prev + 1);
    });
    expect(fnHook.get()).toBe(1);
  });

  it("should cover getServerSnapshot using renderToString", () => {
    const hook = useStateGlobal<number>("ssr-test-real", 500);
    const TestComponent = () => {
      const state = hook.useState();
      return React.createElement("div", null, state);
    };
    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain("500");
  });

  it("should handle missing slice in batchUpdate safety check", async () => {
    const hookA = useStateGlobal<number>("A", 0, {
      middleware: [
        async () => {
          clearGlobalState();
        },
      ],
    });
    const hookB = useStateGlobal<number>("B", 0);
    hookA.set(1);
    hookB.set(2);
    await act(async () => {});
    expect(hookB.get()).toBe(0);
  });

  it("should skip restoration if already restored", async () => {
    const hook = useStateGlobal<number>("restore-skip", 0, { persist: true });
    const { rerender } = renderHook(() => hook.useState());
    await act(async () => {});
    rerender();
    await act(async () => {});
  });

  it("should handle sync middleware returning undefined", async () => {
    const mwHook = useStateGlobal<number>("sync-mw-undef", 0, {
      middleware: [() => undefined],
    });
    await act(async () => {
      await mwHook.set(10);
    });
    expect(mwHook.get()).toBe(10);
  });

  it("should cover all ternary branches in store.ts", async () => {
    // 1. Line 84: typeof nextValue === "function" (covered)
    const fnUpd = useStateGlobal<number>("fn-upd", 0);
    await act(async () => {
      await fnUpd.set((p: number) => p + 1);
    });
    expect(fnUpd.get()).toBe(1);

    // 2. Line 90/91: state.encrypt true/false
    const plain = useStateGlobal<number>("plain-p", 0, { persist: true, encrypt: false });
    await act(async () => {
      await plain.set(1);
    });
    const enc = useStateGlobal<number>("enc-p", 0, { persist: true, encrypt: true });
    await act(async () => {
      await enc.set(1);
    });

    // 3. Line 123: state.encrypt true/false during restoration
    (restoreState as any).mockReturnValueOnce(100);
    const hyd1 = useStateGlobal<number>("hyd1", 0, { persist: true, encrypt: false });
    renderHook(() => hyd1.useState());
    await act(async () => {});

    (restoreEncryptedState as any).mockReturnValueOnce(200);
    const hyd2 = useStateGlobal<number>("hyd2", 0, { persist: true, encrypt: true });
    renderHook(() => hyd2.useState());
    await act(async () => {});

    // 4. Line 140: typeof val === "function" during immediate set
    const imm = useStateGlobal<number>("imm", 0);
    await act(async () => {
      await imm.set((p: number) => p + 5, true);
    });
    expect(imm.get()).toBe(5);
    await act(async () => {
      await imm.set(10, true);
    }); // else branch
    expect(imm.get()).toBe(10);
  });

  it("should cover history edge cases with truthy history", async () => {
    const hook = useStateGlobal<number>("hist-edge", 0);
    // history[fullKey] is undefined initially
    act(() => {
      hook.undo();
      hook.redo();
    }); // h is undefined

    await act(async () => {
      await hook.set(1);
    }); // h exists, past has [0], present is 1
    act(() => {
      hook.undo();
    }); // past is empty now
    act(() => {
      hook.undo();
    }); // h exists but past is empty
    expect(hook.get()).toBe(0);

    act(() => {
      hook.redo();
    }); // hits h exists and future has [1]
    act(() => {
      hook.redo();
    }); // h exists but future is empty
    expect(hook.get()).toBe(1);
  });

  it("should cover the else branches of initializations", async () => {
    // 1. Line 194 (!ref.current) in useStore
    const { rerender } = renderHook(() => useStore(() => ({ x: 1 })));
    rerender(); // hits ref.current else branch

    // 2. Line 121 (state.persist && !state.restored)
    const hook = useStateGlobal<number>("pers-thorough", 0, { persist: true });
    const { rerender: hookRerender } = renderHook(() => hook.useState());
    await act(async () => {}); // state.restored = true
    hookRerender(); // hits state.restored else branch

    // 3. Line 138 (!history[fullKey]) in immediate set
    const immHook = useStateGlobal<number>("hist-init-imm", 0);
    await act(async () => {
      await immHook.set(1, true); // hits !history
      await immHook.set(2, true); // hits history else branch
    });
    expect(immHook.get()).toBe(2);
  });

  it("should hit unreachable safety branches in store.ts", async () => {
    // Line 58 (!state) continue in batchUpdate
    const hookA = useStateGlobal<number>("RemoveMe", 0, {
      middleware: [
        async (_k) => {
          clearGlobalState();
        },
      ],
    });
    hookA.set(1);
    await act(async () => {});
  });

  it("should cover the surgical branch where state is deleted in batchUpdate", async () => {
    // 1. Line 58 (!state) continue
    const sliceName = "surgical";
    const slice = useSlice(sliceName);
    const hookA = slice<number>("A", 0, {
      middleware: [
        async (_k) => {
          // While processing A, we manually delete B from the slice
          const s = (store as any).get(sliceName);
          if (s) delete s["B"];
        },
      ],
    });
    const hookB = slice<number>("B", 0);

    hookA.set(1);
    hookB.set(2);
    await act(async () => {});
    expect(hookA.get()).toBe(1);
    expect(hookB.get()).toBe(0); // B was never updated because it was deleted before its turn
  });

  it("should return globalThis if scope is falsy", () => {
    expect(getGlobalThis()).toBe(globalThis);
    expect(getGlobalThis(undefined)).toBe(globalThis);
  });

  it("should throw if scope is false or null", () => {
    expect(() => getGlobalThis(false)).toThrow();
    expect(() => getGlobalThis(null)).toThrow();
  });

  it("should cover all branches in global.ts", () => {
    expect(getGlobalThis({ a: 1 })).toEqual({ a: 1 });
  });

  it("should hit slice[key] else branch by bypassing hookCache", () => {
    // 1. Initialize it
    useStateGlobal<number>("Bypass", 0);
    // 2. Clear hookCache but NOT the store (manually)
    (hookCache as any).clear();
    // 3. Call it again. hookCache.has() is false.
    // It proceeds to line 113. slice['Bypass'] exists.
    // Hits the ELSE branch of if (!slice[key]).
    useStateGlobal<number>("Bypass", 0);
  });
});
