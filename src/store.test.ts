import produce from "immer";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStateGlobal } from "./store";
import { saveState, restoreState } from "./persistence";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { notifyDevTools, undoState, redoState, measurePerformance } from "./devtools";

// Mock all external dependencies
vi.mock("./persistence", () => ({
  saveState: vi.fn(),
  restoreState: vi.fn(),
}));

vi.mock("./encryption", () => ({
  saveEncryptedState: vi.fn(),
  restoreEncryptedState: vi.fn(),
}));

vi.mock("./devtools", () => ({
  notifyDevTools: vi.fn(),
  undoState: vi.fn(),
  redoState: vi.fn(),
  measurePerformance: vi.fn(),
}));

vi.mock("./global", () => ({
  globalObject: {
    requestAnimationFrame: vi.fn((cb) => cb()),
  },
}));

vi.mock("use-sync-external-store/shim", () => ({
  useSyncExternalStore: vi.fn((subscribe, getSnapshot) => getSnapshot()),
}));

vi.mock("immer", () => ({
  default: vi.fn((state, producer) => producer(state)),
}));

describe("useStateGlobal Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize state correctly", () => {
    const counter = useStateGlobal("counter", 0);
    expect(counter.useStore()).toBe(0);
  });

  it("should persist state when `persist` option is true", () => {
    useStateGlobal("persistedKey", "test", { persist: true });

    expect(restoreState).toHaveBeenCalledWith("persistedKey", "test");
  });

  it("should persist encrypted state when `encrypt` is true", () => {
    useStateGlobal("secureKey", "secret", { persist: true, encrypt: true });

    expect(restoreEncryptedState).toHaveBeenCalledWith("secureKey", "secret");
  });

  it("should update state and notify devtools", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(5);

    expect(counter.useStore()).toBe(5);
    expect(notifyDevTools).toHaveBeenCalledWith("counter", 5);
    expect(measurePerformance).toHaveBeenCalledWith("counter", expect.any(Function));
  });

  it("should support middleware for state updates", () => {
    const middleware = vi.fn((key, prev, next) => next + 10);
    const counter = useStateGlobal("counter", 0, { middleware: [middleware] });

    counter.set(5);

    expect(middleware).toHaveBeenCalledTimes(1);
    expect(counter.useStore()).toBe(15); // Ensure middleware applied correctly
  });

  it("should call `undoState` when undo is triggered", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(1);
    counter.set(2);
    counter.undo();

    expect(undoState).toHaveBeenCalledWith("counter");
  });

  it("should call `redoState` when redo is triggered", () => {
    const counter = useStateGlobal("counter", 0);
    counter.set(1);
    counter.set(2);
    counter.undo();
    counter.redo();

    expect(redoState).toHaveBeenCalledWith("counter");
  });

  it("should persist state when `persist` is enabled", () => {
    const counter = useStateGlobal("counter", 0, { persist: true });
    counter.set(5);

    expect(saveState).toHaveBeenCalledWith("counter", 5);
  });

  it("should persist encrypted state when `encrypt` is enabled", () => {
    const counter = useStateGlobal("secureCounter", 0, { persist: true, encrypt: true });
    counter.set(10);

    expect(saveEncryptedState).toHaveBeenCalledWith("secureCounter", 10);
  });
});
