export const derivedState = <T, D extends { useStore: () => unknown }[]>(
  dependencies: D,
  computeFn: (...values: { [K in keyof D]: ReturnType<D[K]["useStore"]> }) => T,
) => {
  return () => {
    const values = dependencies.map((dep) => dep.useStore()) as {
      [K in keyof D]: ReturnType<D[K]["useStore"]>;
    };
    return computeFn(...values);
  };
};
