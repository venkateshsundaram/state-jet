---
sidebar_position: 4
id: middlewares
title: Middlewares
slug: /api-reference/middlewares/
description: Middlewares for State-jet
keywords:
- Middlewares
---

A `middleware` property from `options` helps to add middleware for state-jet. Unlike other libraries, you do not need to rely on any external dependencies.

```tsx
function useStateGlobal<T>(
    ...
    options?: { middleware?: Middleware<T>[] }
) 
```

- `options` - An optional parameter which supports multiple options
   * `middleware` - which is used to add middleware support for statejet

### Logger Middleware

Setup Middleware file (`src/store/middleware.ts`):

```ts title="src/store/middleware.ts"
export const loggerMiddleware = (key: string, prev: number, next: number) => {
  console.log(`[state-jet] ${key}: ${prev} → ${next}`);
};
```

Create global state with loggerMiddleware in `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";
import { loggerMiddleware } from "./middleware";
 
export const counterState = useStateGlobal("counter", 0, { middleware: [loggerMiddleware] });
```

Binding Global State to a Component in `src/components/Counter.tsx`:

```tsx title="src/components/Counter.tsx"
import { counterState } from "../store";

export default function Counter() {
  const count = counterState.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counterState.set(count - 1)}>Decrement</button>
      <button onClick={() => counterState.set(count + 1)}>Increment</button>
    </div>
  );
}
```

### Reducer Middleware

Setup Middleware file (`src/store/middleware.ts`):

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

Create global state with reducerMiddleware in `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";
import { reducerMiddleware } from "./middleware";
 
export const counterState = useStateGlobal("counter", 0, { middleware: [reducerMiddleware] });
```

Binding Global State to a Component in `src/components/Counter.tsx`:

```tsx title="src/components/Counter.tsx"
import { counterState } from "../store";

export default function Counter() {
  const count = counterState.useState() as number;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => counterState.set({ type: "DECREMENT" })}>Decrement</button>
      <button onClick={() => counterState.set({ type: "INCREMENT" })}>Increment</button>
      <button onClick={() => counterState.set({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

### Debounce Middleware

Setup Middleware file (`src/store/middleware.ts`):

```ts title="src/store/middleware.ts"
let timer: ReturnType<typeof setTimeout>;

// Debounce middleware with delay
export const debounceMiddleware = (delay: number) => {
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

Create global state with debounceMiddleware in `src/store/index.ts`:

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";
import { debounceMiddleware } from "./middleware";
 
export const counterState = useStateGlobal("counter", 0, { middleware: [debounceMiddleware(500)] });
```

### Optimistic Middleware

Setup Middleware file (`src/store/middleware.ts`):

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

Create global state with optimisticMiddleware in `src/store/index.ts`

```ts title="src/store/index.ts"

import { useStateGlobal } from "state-jet";
import { optimisticMiddleware } from "./middleware";
 
export const profileState = useStateGlobal("profile", { name: "John" }, { 
  middleware: [optimisticMiddleware("/update-profile")],
});
```

### Custom Middleware

Setup Middleware file (`src/store/middleware.ts`):

```ts title="src/store/middleware.ts"
export const validateAgeMiddleware = (key: string, prev: number, next: number) => {
    if (next < 0) {
        console.warn("Age cannot be negative!");
        return prev;
    }
    return next;
};
```

Create global state with validateAgeMiddleware

```ts title="src/store/index.ts"
import { useStateGlobal } from "state-jet";
import { validateAgeMiddleware } from "./middleware";
 
export const ageState = useStateGlobal("age", 0, { middleware: [validateAgeMiddleware] });
```

Binding Global State to a Component in `src/components/Profile.tsx`:

```tsx title="src/components/Profile.tsx"
import { ageState } from "../store";

export default function Profile() {
  const age = ageState.useState() as number;

  return (
    <div>
        <h1>Age: {age}</h1>
        <button 
            onClick={() => {
                ageState.set(-5) //Age will be 0 eventhough it updated with negative value due to middleware logic
            }}>
        Set negative
        </button> 
    </div>
  );
}
```
