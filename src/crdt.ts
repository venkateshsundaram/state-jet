export const mergeCRDT = <T>(localState: T, remoteState: T): T => {
  return { ...localState, ...remoteState, lastUpdated: Date.now() };
};

export const syncCRDT = <T>(
  remoteState: T,
  setState: { useState: () => T; set: (state: T) => void },
) => {
  const localState = setState.useState();
  const mergedState = mergeCRDT(localState, remoteState);
  setState.set(mergedState);
};
