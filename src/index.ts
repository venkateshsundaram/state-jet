import { useStateGlobal, useSlice, useStore } from "./store";
import { saveState, restoreState } from "./persistence";
import { optimisticUpdate } from "./optimistic";
import { saveEncryptedState, restoreEncryptedState } from "./encryption";
import { syncCRDT, mergeCRDT } from "./crdt";
import { derivedState } from "./derived";

export const VERSION = "2.4.0";

export {
  useStateGlobal,
  useSlice,
  useStore,
  saveState,
  restoreState,
  optimisticUpdate,
  saveEncryptedState,
  restoreEncryptedState,
  syncCRDT,
  mergeCRDT,
  derivedState,
};
