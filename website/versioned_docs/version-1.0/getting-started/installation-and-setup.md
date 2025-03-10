---
sidebar_position: 2
id: installation-and-setup
title: Installing in a Project
slug: /getting-started/installation-and-setup/
description: StateJet installation and setup guide
keywords:
- installation
- setup
---


StateJet is a state management library for React, so you must have React installed and running to use it. The easiest and recommended way for bootstrapping a React application is to use either [Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react) or [Create React App](https://github.com/facebook/create-react-app#creating-an-app)

To run it, make sure you have a clean working directory:

## Vite

Open your terminal and run:

```
npm create vite@latest my-app --template react
```

(or use `yarn` or `pnpm` instead of `npm` as you prefer).

`Or`

## Create React App

Open your terminal and run:

```
npx create-react-app my-app
```

(or use `yarn` or `pnpm` instead of `npm` as you prefer).

* * *

# Manual Installation

To install the latest stable version, run the following command:

```sh
npm install state-jet
```

Or if you're using yarn:

```sh
yarn add state-jet
```

Or if you're using `cdn`:

```sh
<script src="https://cdn.jsdelivr.net/npm/state-jet@latest/dist/index.cjs"></script>
```