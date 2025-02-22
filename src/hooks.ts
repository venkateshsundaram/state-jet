import { useEffect, useState } from 'react';

function useSyncExternalStore(subscribe: Function, getSnapshot: Function) {
  // State to hold the current snapshot of the store
  const [snapshot, setSnapshot] = useState(getSnapshot());

  // Effect to subscribe to the external store
  useEffect(() => {
    // Function to update the snapshot when the store changes
    const handleStoreChange = () => {
      setSnapshot(getSnapshot());
    };

    // Subscribe to the store and get the unsubscribe function
    const unsubscribe = subscribe(handleStoreChange);

    // Ensure the snapshot is up-to-date after subscribing
    handleStoreChange();

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [subscribe, getSnapshot]);

  // Return the current snapshot
  return snapshot;
}

export { useSyncExternalStore };
