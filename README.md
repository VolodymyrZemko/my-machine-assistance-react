# CMS React Test Modular Structure

## Overview
Refactored `App.jsx` into a lightweight connector that orchestrates four machine-related tabs while delegating user & machine fetching logic to dedicated modules.

## Key Modules & Components
- `src/modules/user/useUser.js` – Hook encapsulating login detection and machine retrieval via `window.napi`.
- `src/context/UserContext.jsx` – Provides user state across the app (memberId, machines, loading, error, refreshMachines).
- `src/components/tabs/Tabs.jsx` – Generic tabs and content renderer.
- `src/components/machines/MyAccountMachine.jsx` – Uses user context; lists machines with refresh.
- `src/components/machines/OLMachine.jsx` / `VLMachine.jsx` / `MilkMachine.jsx` – Placeholder components for future logic.
- `src/App.jsx` – Orchestrates active tab + wraps content with `UserProvider`.

## Tabs
1. My Account Machine – Shows user machines & login state.
2. OL Machine – Placeholder for OL-specific features.
3. VL Machine – Placeholder for VL-specific features.
4. Milk Machine – Placeholder for milk-related machine features.

## How to Extend
- Add logic to other machine components as requirements become clear.
- Enhance `useUser` with caching, error retries, or optimistic updates.
- Introduce routing (React Router already installed) if deep-linking per tab is needed.

## Future Ideas
- Machine detail view component.
- Persist selected tab in URL or localStorage.
- Internationalization (i18n) for Ukrainian & English.

## Quick Start
```bash
npm install
npm run dev
```

## Notes
All network calls remain centralized for easier maintenance & potential migration to a dedicated service layer later.
