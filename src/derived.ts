export const derivedState = <T>(
  dependencies: { useStore: () => any }[],
  computeFn: (...values: any[]) => T
) => {
  const derived = { value: computeFn(...dependencies.map((dep) => dep.useStore())) };

  dependencies.forEach((dep) =>
    dep.useStore().listeners.add(() => {
      derived.value = computeFn(...dependencies.map((dep) => dep.useStore()));
    })
  );

  return () => derived.value;
};
