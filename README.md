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

## Hash-Based Machine Deep Links
Machine detail pages are now exposed via location hash instead of a router:

Format: `#machine/<id>` (e.g. `#machine/vertuo-plus`).

Deep linking: You can link directly to a machine detail by appending the hash to the page URL:
```
https://www.nespresso.com/gr/en/test-page-gwp#machine/vertuo-plus
```
or on GitHub Pages:
```
https://VolodymyrZemko.github.io/my-react-cms-app/#machine/pixie
```

Behavior:
- When a matching hash is present, tabs are hidden and the machine detail component is shown.
- Clicking Back (or clearing the hash manually) restores the tab interface.
- No dependency on React Router, minimizing interference with CMS scripts.

Implementation Details:
- `useMachineRoute` listens for `hashchange` events and extracts machine id.
- `MachineDetail` is prop-driven and updates `document.title` during view lifecycle.

To programmatically open a machine: `window.location.hash = 'machine/<id>'`.

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
