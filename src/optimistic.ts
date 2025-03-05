export const optimisticUpdate = async <T>(
  setState: { set: (value: T) => void; useStore: () => T },
  updateFn: (prevState: T) => T,
  apiCall: () => Promise<any>,
  rollbackFn?: (prevState: T) => T
) => {
  const prevState = setState.useStore(); // Save the previous state
  const optimisticState = updateFn(prevState);

  setState.set(optimisticState); // Apply optimistic update

  try {
    await apiCall(); // Wait for API response
  } catch (error) {
    console.error("API request failed:", error);
    setState.set(rollbackFn ? rollbackFn(prevState) : prevState); // Rollback on failure
  }
};
