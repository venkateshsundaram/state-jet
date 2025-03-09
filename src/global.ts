const getGlobalThis = (): typeof globalThis => {
  if (typeof globalThis === "object" && globalThis) return globalThis;
  if (typeof self === "object" && self) return self;
  if (typeof window === "object" && window) return window;
  if (typeof global !== "undefined" && typeof global === "object" && global) return global;
  throw new Error("Unable to locate global `this`");
};

export const globalObject: typeof globalThis = getGlobalThis();
