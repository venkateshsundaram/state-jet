---
sidebar_position: 2
id: middlewares
title: Middlewares
slug: /api-reference/middlewares/
description: Middlewares for State-jet
keywords:
- Middlewares
---

A `middleware` from `options` helps to add middleware for state-jet. Unlike other libraries, you do not need to rely on any external dependencies.

```tsx
function useStateGlobal<T>(
    ...
    options?: { middleware?: Middleware<T>[] }
) 
```

- `options` - An optional parameter which supports multiple options
   * `middleware` - which is used to add middleware support for state jet

### Logger Middleware

**🔹 Step 1: Setup Middleware file (`src/socket/middleware.ts`):**

```ts title="src/store/middleware.ts"
export const loggerMiddleware = (key: string, prev: number, next: number) => {
    console.log(`[state-jet] ${key}: ${prev} → ${next}`);
};
```

**🔹 Step 2: Use loggerMiddleware in main store `src/store/counterStore.ts`:**

```ts title="src/store/counterStore.ts"
import { useStateGlobal } from "state-jet";
import { loggerMiddleware } from "./middleware";

const counterStore = useStateGlobal("counter", 0, { middleware: [loggerMiddleware] });
```

### Reducer Middleware

**🔹 Step 1: Setup Middleware file (`src/socket/middleware.ts`):**

```ts title="src/store/middleware.ts"
type Action<T> = { type: string; payload?: T };
type Middleware<T> = (
  key: string,
  prev: T,
  next: T | Action<T> | any,
  set?: (value: T) => void,
) => T | void | Promise<void>;

export const reducerMiddleware: Middleware<number> = (key, prev, action: Action<any>) => {
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
```

**🔹 Step 2: Use reducerMiddleware in main store `src/store/counterStore.ts`:**

```ts title="src/store/counterStore.ts"
import { useStateGlobal } from "state-jet";
import { reducerMiddleware } from "./middleware";

const counterStore = useStateGlobal("counter", 0, { middleware: [reducerMiddleware] });
```

### Debounce Middleware

**🔹 Step 1: Setup Middleware file (`src/socket/middleware.ts`):**

```ts title="src/store/middleware.ts"
let timer: ReturnType<typeof setTimeout>;
export const debounceMiddleware = (delay: number) => {
    return (key: string, prev: number, next: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
        console.log(`[state-jet] Debounced: ${key} → ${next}`);
          return next;
        }, delay);
        return prev;
    };
};
```

**🔹 Step 2: Use debounceMiddleware in main store `src/store/counterStore.ts`:**

```ts title="src/store/counterStore.ts"
import { useStateGlobal } from "state-jet";
import { debounceMiddleware } from "./middleware";

const counterStore = useStateGlobal("counter", 0, { middleware: [debounceMiddleware(500)] });
```

### Optimistic Middleware

**🔹 Step 1: Setup Middleware file (`src/socket/middleware.ts`):**

```ts title="src/store/middleware.ts"
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
```

**🔹 Step 2: Use optimisticMiddleware in main store `src/store/profileStore.ts`:**

```ts title="src/store/profileStore.ts"
import { useStateGlobal } from "state-jet";
import { optimisticMiddleware } from "./middleware";

const profileStore = useStateGlobal("profile", { name: "John" }, {
  middleware: [optimisticMiddleware("/update-profile")],
});
```

### Custom Middleware

**🔹 Step 1: Setup Middleware file (`src/socket/middleware.ts`):**

```ts title="src/store/middleware.ts"
export const validateAgeMiddleware = (key: string, prev: number, next: number) => {
    if (key === "age" && next < 0) {
        console.warn("Age cannot be negative!");
        return prev;
    }
    return next;
};
```

**🔹 Step 2: Use validateAgeMiddleware in main store `src/store/ageStore.ts`:**

```ts title="src/store/ageStore.ts"
import { useStateGlobal } from "state-jet";
import { validateAgeMiddleware } from "./middleware";

export const ageStore = useStateGlobal("age", 0, { middleware: [validateAgeMiddleware]});
```
