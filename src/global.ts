// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGlobalThis = (_scope?: any): any => {
  if (_scope === false || _scope === null) throw new Error("Unable to locate global `this`");
  return _scope || globalThis;
};
export const globalObject = getGlobalThis();
