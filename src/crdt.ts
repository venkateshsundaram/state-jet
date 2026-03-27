export const mergeCRDT = <T>(localState: T, remoteState: T): T => {
  return { ...localState, ...remoteState, lastUpdated: Date.now() };
};

export const syncCRDT = <T>(remoteState: T, getStateValue: () => T, set: (state: T) => void) => {
  const localState = getStateValue();
  const mergedState = mergeCRDT(localState, remoteState);
  set(mergedState);
};
