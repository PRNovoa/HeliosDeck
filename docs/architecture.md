# Helios Deck - Architecture

## Overview

Helios Deck is a client-side React/Vite static SPA intended for Vercel. It uses
public orbital and space-weather APIs, normalizes heterogeneous payloads into a
shared signal contract, and renders them through React Query-backed widgets and
signal pages.

There is no custom backend, SSR layer, database, or TypeScript conversion.

## Data Pipeline

Every live signal follows this pipeline:

```txt
Public REST/JSON API
-> API client in src/services/api
-> normalizer in src/services/normalizers
-> TanStack React Query hook in src/hooks
-> widget/page UI
```

Network calls stay in `src/services/api`. Widgets and pages consume hooks and do
not fetch directly.

## Current Signals

| Signal | Provider | Hook | Widget/Page status |
|---|---|---|---|
| ISS Position | wheretheiss.at | `useISSPosition` | Dashboard widget + signal page |
| Kp Index | NOAA SWPC | `useKpIndex` | Dashboard widget + signal page |
| Solar Flares | NASA DONKI | `useSolarFlares` | Dashboard widget + signal page |
| Space Weather Alerts | NOAA SWPC | `useSpaceWeatherAlerts` | Dashboard widget + catalogue |
| CME Events | NASA DONKI | `useCME` | Dashboard widget + signal page |
| Solar Wind Speed | NOAA SWPC | `useSolarWind` | Dashboard widget + signal page |
| Solar Wind Density | NOAA SWPC | `useSolarWind` | Dashboard widget + shared signal page |
| Aurora Oval | NOAA SWPC | `useAurora` | Dashboard widget + signal page |
| GOES X-Ray Flux | NOAA SWPC | `useSolarRadiation` | Dashboard widget + signal page |
| Solar Radio Flux | NOAA SWPC | `useSolarRadioFlux` | Dashboard widget + catalogue |

Signal metadata lives in `src/lib/signalRegistry.js`; dashboard defaults live in
`WIDGET_REGISTRY` inside `src/lib/constants.js`.

## Routing And Layout

- Router: `createBrowserRouter` in `src/app/router.jsx`
- Route constants: `src/app/routes.js`
- Public route: `/login`
- Protected app shell: `/`, `/dashboard`, `/signals`, signal pages, sources,
  alerts, analysis, settings, and about
- Vercel routing: `vercel.json` rewrites every route to `/index.html`

## Authentication

- Provider: DummyJSON auth API
- Test credentials: `emilys` / `emilyspass`
- Session storage: `localStorage["helios_auth"]`
- Guard: `ProtectedRoute` redirects unauthenticated users to `/login`

## Dashboard Persistence

Dashboard widget configuration persists in localStorage under
`helios-deck:dashboard-config`. Configuration is merged with `WIDGET_REGISTRY`
so new registry entries can be introduced without breaking existing saved
layouts.

The dashboard uses `react-grid-layout` for drag and resize behavior.

## API And Environment Strategy

| Source | Development | Production |
|---|---|---|
| wheretheiss.at | Direct fetch | Direct fetch |
| DummyJSON | Direct fetch | Direct fetch |
| NASA DONKI | Vite proxy `/api/nasa` | Direct `https://api.nasa.gov` |
| NOAA SWPC | Vite proxy `/api/noaa` | Direct `https://services.swpc.noaa.gov` |

Environment variable:

```txt
VITE_NASA_API_KEY
```

The NASA key is optional and falls back to `DEMO_KEY`, but Vercel deployments
should define it to avoid DONKI quota issues. Vite environment variables are
public in the browser bundle.

## Testing

Vitest is configured in `vite.config.js` with a Node test environment. Normalizer
tests are pure and do not call the network.

Run:

```bash
npm run test
```

Deployment checks:

```bash
npm run build
npm run lint
npm run test
```
