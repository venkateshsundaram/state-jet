import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStateGlobal } from './store';
import { saveState, restoreState } from './persistence';
import { notifyDevTools, undoState, redoState, measurePerformance } from './devtools';

// Mock dependencies
vi.mock('./persistence', () => ({
  saveState: vi.fn(),
  restoreState: vi.fn(),
}));

vi.mock('./devtools', () => ({
  notifyDevTools: vi.fn(),
  undoState: vi.fn(),
  redoState: vi.fn(),
  measurePerformance: vi.fn(),
}));

vi.mock('./global', () => ({
  globalObject: {
    requestAnimationFrame: vi.fn()
  }
}));

describe('useStateGlobal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize state with initial value', () => {
    const { useStore } = useStateGlobal('testKey', 'initialValue');
    const state = useStore();
    expect(state).toBe('initialValue');
  });

  it('should update state', () => {
    const { useStore, set } = useStateGlobal('testKey', 'initialValue');
    set('newValue');
    const state = useStore();
    expect(state).toBe('newValue');
  });

  it('should call middleware on state update', () => {
    const middleware = vi.fn((key, prev, next) => next);
    const { set } = useStateGlobal('testKey', 'initialValue', { middleware: [middleware] });
    set('newValue');
    expect(middleware).toHaveBeenCalledWith('testKey', 'initialValue', 'newValue');
  });

  it('should persist state if persist option is true', () => {
    const { set } = useStateGlobal('testKey', 'initialValue', { persist: true });
    set('newValue');
    expect(saveState).toHaveBeenCalledWith('testKey', 'newValue', undefined);
  });

  it('should restore state if persist option is true', () => {
    restoreState.mockImplementation((key) => {
      if (key === 'testKey') return 'restoredValue';
    });
    const { useStore } = useStateGlobal('testKey', 'initialValue', { persist: true });
    const state = useStore();
    expect(state).toBe('restoredValue');
  });

  it('should handle undo operation', () => {
    const { set, undo, useStore } = useStateGlobal('testKey', 'initialValue');
    set('newValue');
    undo();
    const state = useStore();
    expect(state).toBe('initialValue');
    expect(undoState).toHaveBeenCalledWith('testKey');
  });

  it('should handle redo operation', () => {
    const { set, undo, redo, useStore } = useStateGlobal('testKey', 'initialValue');
    set('newValue');
    undo();
    redo();
    const state = useStore();
    expect(state).toBe('newValue');
    expect(redoState).toHaveBeenCalledWith('testKey');
  });

  it('should handle edge case of undo with no history', () => {
    const { undo, useStore } = useStateGlobal('testKey', 'initialValue');
    undo();
    const state = useStore();
    expect(state).toBe('initialValue');
  });

  it('should handle edge case of redo with no future', () => {
    const { redo, useStore } = useStateGlobal('testKey', 'initialValue');
    redo();
    const state = useStore();
    expect(state).toBe('initialValue');
  });

  it('should notify dev tools on state update', () => {
    const { set } = useStateGlobal('testKey', 'initialValue');
    set('newValue');
    expect(notifyDevTools).toHaveBeenCalledWith('testKey', 'newValue');
  });

  it('should measure performance on state update', () => {
    const { set } = useStateGlobal('testKey', 'initialValue');
    set('newValue');
    expect(measurePerformance).toHaveBeenCalledWith('testKey', expect.any(Function));
  });
});
