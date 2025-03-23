export const derivedState = <T, D extends { useState: () => unknown }[]>(
  dependencies: D,
  computeFn: (...values: { [K in keyof D]: ReturnType<D[K]["useState"]> }) => T,
) => {
  return () => {
    const values = dependencies.map((dep) => dep.useState()) as {
      [K in keyof D]: ReturnType<D[K]["useState"]>;
    };
    return computeFn(...values);
  };
};
