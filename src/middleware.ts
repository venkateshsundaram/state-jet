export const loggerMiddleware = (key: string, prev: number, next: number) => {
    console.log(`[state-jet] ${key}: ${prev} → ${next}`);
};

export const apiSyncMiddleware = async (key: string, prev: number, next: number) => {
    await fetch("/api/sync", { method: "POST", body: JSON.stringify({ key, next }) });
};

export const validateAgeMiddleware = (key: string, prev: number, next: number) => {
    if (key === "age" && next < 0) {
        console.warn("Age cannot be negative!");
        return prev;
    }
    return next;
};

export const optimisticMiddleware = (apiUrl: string) => {
    return async (key: string, prev: number, next: number, set: any) => {
        set(next); // Optimistically update state

        try {
            await fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify({ key, value: next }),
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.warn(`[state-jet] Rollback: Failed to sync ${key}`);
            set(prev); // Rollback state on failure
        }
    };
};

type Action<T> = { type: string; payload?: T };

export const reducerMiddleware = (key: string, prev: number, action: Action<any>) => {
    switch (action.type) {
        case "INCREMENT":
            return prev + 1;
        case "DECREMENT":
            return prev - 1;
        case "RESET":
            return 0;
        default:
            return prev;
    }
};

export const debounceMiddleware = (delay: number) => {
    let timer: any;
    return (key: string, prev: number, next: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(`[state-jet] Debounced: ${key} → ${next}`);
      }, delay);
      return prev; // Prevent immediate update
    };
};
  