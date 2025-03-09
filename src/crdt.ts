export const mergeCRDT = <T>(localState: T, remoteState: T): T => {
  return { ...localState, ...remoteState, lastUpdated: Date.now() };
};

export const syncCRDT = <T>(
  remoteState: T,
  setState: { useStore: () => T; set: (state: T) => void },
) => {
  const localState = setState.useStore();
  const mergedState = mergeCRDT(localState, remoteState);
  setState.set(mergedState);
};
