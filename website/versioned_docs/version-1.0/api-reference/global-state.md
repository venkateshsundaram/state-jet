---
sidebar_position: 1
id: global-state
title: useStateGlobal()
slug: /api-reference/global-state/
description: Global state set up for State-jet
keywords:
- global state
---

An `useStateGlobal()` represents main store in State-jet. It enables storing global data across React components without using a store.

```tsx
function useStateGlobal<T>(
    key: string,
    initialValue?: T,
    options?: { middleware?: Middleware<T>[], persist?: boolean, encrypt?: boolean }
) 
```

- `key` - A unique string used to identify the store.

- `initialValue` - can store any data types (string, array, object)

- `options` - An optional parameter which supports multiple options
   * `middleware` - which is used to add middleware support for statejet. Refer (**[Middlewares](/docs/api-reference/middlewares)**)
   * `persist` - if persist is true, the store data will be stored in localStorage. Refer (**[Persistence](/docs/api-reference/persistence)**)
   * `encrypt` - supports encryption/decryption. Refer (**[Encryption](/docs/api-reference/encryption)**)

    It returns the following properties:  
        - **`set()`** – Updates the state data.  
        - **`useStore()`** – Retrieves the latest state data.  
        - **`undo()`** – Reverts the state to the previous value. Refer (**[Undo](/docs/api-reference/redo-undo)**)
        - **`redo()`** – Restores the undone state. Refer (**[Redo](/docs/api-reference/redo-undo)**)
        - **`clear()`** – Resets the state data. Refer (**[Clear](/docs/api-reference/redo-undo)**)