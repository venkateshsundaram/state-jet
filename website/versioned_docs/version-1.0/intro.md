---
sidebar_position: 1
id: home
title: Home
slug: /
description: State Jet documentation landing page
keywords:
- State
- Jet
- data
- introduction
- home
---

# StateJet

StateJet is a global state management library for React that allows you to store and update data from any component. It is lightweight, easy to use, and simple to maintain.

## ⚡ Features

- **Ultra-Lightweight** – Ultra minified, smaller than Zustand, Jotai, and Recoil.
- **Zero-Boilerplate** – No reducers, actions, or providers. Just import and use.
- **No Context or Providers** – Works outside React’s context system, avoiding unnecessary re-renders.
- **Fine-Grained Reactivity** – Only components using a specific state value update.
- **Automatic Re-Renders** – Components only re-render when the specific state they depend on changes.
- **SSR & Next.js Support** – Works seamlessly on both client and server.
- **Optimistic Updates & Rollback** – Enables instant UI updates with automatic rollback on failure.
- **Middleware Support** – Apply logging, transformations, validation, and API syncing before updating state.
- **Undo/Redo Support** – Built-in state history tracking for time-travel debugging.
- **CRDT Conflict Resolution** – Ensures consistent state across distributed systems.
- **Persisted State** – Syncs with localStorage.
- **Selectors & Derivations** – Efficiently compute derived state without unnecessary re-renders.
- **Works with React 18+** – Fully supports for optimal state tracking.
- **No Proxy Overhead** – Uses direct object mutation, avoiding unnecessary proxy complexity.
- **Supports Server Actions** – Works with Next.js Server Actions & Edge Functions.
- **Batched Updates & Memoization** – Optimized performance with minimal renders.
- **Reactive State Hydration** – Efficiently hydrates server-side state on the client.

## Stack

StateJet operates on both the client and server sides. It is framework-agnostic, compatible with React, React Native and Next.js.

## Where to Go from Here

<div className="bigCallToAction">
Start with the <strong><a href="/docs/tutorial/intro/">tutorial</a></strong> — it will take you step-by-step.
</div>


- An overview of the **[prerequisites](/docs/getting-started/prerequisites/)** for using state-jet, and an **[installation and setup guide](/docs/getting-started/installation-and-setup/)**.
- The **[API reference](/docs/api-reference/global-state/)**, for a reference of our APIs including a detailed overview of their inputs and outputs.
