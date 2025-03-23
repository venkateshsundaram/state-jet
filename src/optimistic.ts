export const optimisticUpdate = async <T>(
  setState: { set: (value: T) => void; useState: () => T },
  updateFn: (prevState: T) => T,
  apiCall: () => Promise<T>,
  rollbackFn?: (prevState: T) => T,
) => {
  const prevState = setState.useState(); // Save the previous state
  const optimisticState = updateFn(prevState);

  setState.set(optimisticState); // Apply optimistic update

  try {
    await apiCall(); // Wait for API response
  } catch (error) {
    console.error("API request failed:", error);
    setState.set(rollbackFn ? rollbackFn(prevState) : prevState); // Rollback on failure
  }
};
