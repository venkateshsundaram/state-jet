---
sidebar_position: 4
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

**🔹 Step 1: Setup Middleware file (`src/store/middleware.ts`):**

```ts title="src/store/middleware.ts"
export const loggerMiddleware = (key: string, prev: number, next: number) => {
    console.log(`[state-jet] ${key}: ${prev} → ${next}`);
};
```

**🔹 Step 2: Use loggerMiddleware in `src/components/Counter.tsx`:**

```tsx title="src/components/Counter.tsx"
import { useStateGlobal } from "state-jet";
import { loggerMiddleware } from "../store/middleware";

const counter = useStateGlobal("counter", 0, { middleware: [loggerMiddleware] });

export default function Counter() {
  const count = counter.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counter.set(count - 1)}>Decrement</button>
      <button onClick={() => counter.set(count + 1)}>Increment</button>
    </div>
  );
}
```

### Reducer Middleware

**🔹 Step 1: Setup Middleware file (`src/store/middleware.ts`):**

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

**🔹 Step 2: Use reducerMiddleware in `src/components/Counter.tsx`:**

```tsx title="src/components/Counter.tsx"
import { useStateGlobal } from "state-jet";
import { reducerMiddleware } from "../store/middleware";

const counter = useStateGlobal("counter", 0, { middleware: [reducerMiddleware] });

export default function Counter() {
  const count = counter.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counter.set({ type: "DECREMENT" })}>Decrement</button>
      <button onClick={() => counter.set({ type: "INCREMENT" })}>Increment</button>
      <button onClick={() => counter.set({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

### Debounce Middleware

**🔹 Step 1: Setup Middleware file (`src/store/middleware.ts`):**

```ts title="src/store/middleware.ts"
let timer: ReturnType<typeof setTimeout>;

// Debounce middleware with delay
const debounceMiddleware = (delay: number) => {
    return (key: string, prev: number, next: any, set?: (value: any) => void) => {
        clearTimeout(timer);
        if (set) {
          timer = setTimeout(() => {
            console.log(`[state-jet] Debounced: ${key} → ${next}`);
            set(next); // Apply the debounced update
          }, delay);
        }
    };
};
```

**🔹 Step 2: Use debounceMiddleware in `src/components/Counter.tsx`:**

```tsx title="src/components/Counter.tsx"
import { useStateGlobal } from "state-jet";
import { debounceMiddleware } from "../store/middleware";

const counter = useStateGlobal("counter", 0, { middleware: [debounceMiddleware(500)] });
```

### Optimistic Middleware

**🔹 Step 1: Setup Middleware file (`src/store/middleware.ts`):**

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

**🔹 Step 2: Use optimisticMiddleware in `src/components/Profile.tsx`:**

```tsx title="src/components/Profile.tsx"
import { useStateGlobal } from "state-jet";
import { optimisticMiddleware } from "../store/middleware";

const profile = useStateGlobal("profile", { name: "John" }, { 
    middleware: [optimisticMiddleware("/update-profile")],
});
```

### Custom Middleware

**🔹 Step 1: Setup Middleware file (`src/store/middleware.ts`):**

```ts title="src/store/middleware.ts"
export const validateAgeMiddleware = (key: string, prev: number, next: number) => {
    if (key === "age" && next < 0) {
        console.warn("Age cannot be negative!");
        return prev;
    }
    return next;
};
```

**🔹 Step 2: Use validateAgeMiddleware in `src/components/Profile.tsx`:**

```tsx title="src/components/Profile.tsx"
import { useStateGlobal } from "state-jet";
import { validateAgeMiddleware } from "../store/middleware";

const ageState = useStateGlobal("age", 0, { middleware: [validateAgeMiddleware] });

export default function Profile() {
  const age = ageState.useState() as number;

  return (
    <div>
        <h1>Age: {age}</h1>
        <button 
            onClick={() => {
                counter.set(-5) //Age will be 0 eventhough it updated with negative value due to middleware logic
            }}>
        Set negative
        </button> 
    </div>
  );
}

```
