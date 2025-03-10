---
sidebar_position: 1
id: global-state
title: useStateGlobal()
slug: /api-reference/global-state/
description: Global state set up for State-jet
keywords:
- global state
---

An `useStateGlobal()` represents main store in State-jet. It returns a overall store information.

```jsx
function useStateGlobal<T>(
    key: string,
    initialValue?: T,
    options?: { middleware?: Middleware<T>[], persist?: boolean, encrypt?: boolean }
) 
```

- `key` - A unique string used to identify the store.

- `initialValue` - can store any data types (string, array, object)

- `options` - An optional parameter which supports multiple options
   * `middleware` - which is used to add middleware support for state jet. Refer (**[Middlewares](/docs/api-reference/middlewares)**)
   * `persist` - if persist is true, the store data will be stored in localStorage. Refer(**[Persistence](/docs/api-reference/persistence)**)
   * `encrypt` - supports encryption/decryption. Refer(**[Encryption](/docs/api-reference/encryption)**)