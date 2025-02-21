import { useStateGlobal } from "./store";

export const mergeCRDT = (localState: any, remoteState: any) => {
    return { ...localState, ...remoteState, lastUpdated: Date.now() };
};

export const syncCRDT = (key: string, remoteState: any) => {
    const localState = useStateGlobal(key).useStore();
    const merged = mergeCRDT(localState, remoteState);
    useStateGlobal(key).set(merged);
};
