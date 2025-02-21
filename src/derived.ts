export const derivedState = (dependencies: Array<any>, computeFn: Function) => {
    const derived = { value: computeFn(...dependencies.map((d:any) => d.useStore())) };
    
    dependencies.forEach(dep => dep.useStore().listeners.add(() => {
      derived.value = computeFn(...dependencies.map(d => d.useStore()));
    }));
    
    return () => derived.value;
};
  