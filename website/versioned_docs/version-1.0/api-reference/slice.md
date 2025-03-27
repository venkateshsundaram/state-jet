---
sidebar_position: 2
id: slice
title: useSlice()
slug: /api-reference/slices/
description: Slice set up for State-jet
keywords:
- slices
- slice pattern
- slice
---

An `useSlice()` represents grouped state slice in State-jet.
```jsx
function useSlice<T>(
    sliceKey: string
) 
```

- `sliceKey` - A unique string used to identify the slice.

   It returns the following properties:  
        - **`set()`** – Updates the state data.  
        - **`useState()`** – Retrieves the latest state data.  
        - **`undo()`** – Reverts the state to the previous value. *Refer* (**[Undo](/docs/api-reference/redo-undo)**)
        - **`redo()`** – Restores the undone state. *Refer* (**[Redo](/docs/api-reference/redo-undo)**)
        - **`clear()`** – Resets the state data. *Refer* (**[Clear](/docs/api-reference/redo-undo)**)