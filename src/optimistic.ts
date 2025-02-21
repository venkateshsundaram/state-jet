export const optimisticUpdate = (setState: any, apiCall: any, fallback: any) => {
    const prevState = setState.useStore();
    setState.set(apiCall(prevState));
  
    apiCall()
      .catch(() => setState.set(fallback ? fallback(prevState) : prevState));
  };
  