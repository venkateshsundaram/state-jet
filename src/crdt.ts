export const mergeCRDT = <T>(localState: T, remoteState: T): T  => {
    return { ...localState, ...remoteState, lastUpdated: Date.now() };
};

export const syncCRDT = <T>(remoteState: T, setState: any) => {
    const localState = setState.useStore();
    const mergedState = mergeCRDT(localState, remoteState);
    setState(mergedState);
};