# Helios Deck — Architecture

## Overview

Helios Deck is a **pure client-side React application** (no backend, no SSR) that aggregates real-time geophysical and heliophysical signals from public APIs. It runs as a Static SPA on Vercel.

---

## Data Pipeline

Every signal follows a strict unidirectional pipeline:

```
Public API (REST/JSON)
        │
        ▼
   api client          (src/services/api/)
   fetch + throw       issClient.js / otherClients.js
        │
        ▼
   normalizer          (src/services/normalizers/)
   → NormalizedSignal  normalizeISS / normalizeKpIndex / normalizeSolarFlare
        │
        ▼
   React Query hook    (src/hooks/)
   cached + polled     useISSPosition / useKpIndex / useSolarFlares
        │
        ▼
   Widget / Chart      (src/components/widgets/, src/components/charts/)
        │
        ▼
   Signal page         (src/pages/  wrapped in SignalPageLayout)
        │
        ▼
   Browser
```

The **NormalizedSignal contract** (`src/lib/normalizedSignal.js`) ensures every signal produces an identical top-level shape, making alerting, display, and testing uniform across all data sources.

---

## Directory Structure

```
src/
├── app/
│   ├── router.jsx          createBrowserRouter route tree
│   ├── routes.js           ROUTES constants
│   └── Providers.jsx       QueryClientProvider + AuthProvider + DashboardProvider
├── components/
│   ├── layout/
│   │   ├── Shell.jsx               Navbar + <Outlet /> + footer
│   │   ├── ProtectedRoute.jsx      Auth guard, redirects to /login
│   │   └── SignalPageLayout.jsx    Shared header for all signal pages
│   ├── ui/                         Reusable primitives (PixelCard, Skeleton, EmptyState, JsonInspector …)
│   ├── charts/
│   │   └── SolarFlareSeverityChart.jsx   Recharts BarChart
│   └── widgets/                    Domain widgets (ISS, KpIndex, SolarFlare)
├── context/
│   ├── AuthContext.jsx             JWT state, localStorage persistence
│   └── DashboardContext.jsx        Widget config, localStorage persistence
├── features/
│   └── dashboard/
│       ├── DashboardGrid.jsx
│       ├── WidgetSelector.jsx
│       └── MissionControlHeader.jsx    Live alert level + stats bar
├── hooks/                          One React Query hook per signal
├── lib/
│   ├── constants.js                SIGNAL, SOURCE, KP_LEVEL, FLARE_CLASS, WIDGET_REGISTRY
│   ├── formatters.js               Pure utilities (parseTimestamp, classifyKp, flareClassSeverity …)
│   ├── queryClient.js              TanStack Query defaults
│   ├── normalizedSignal.js         NormalizedSignal JSDoc typedef
│   ├── signalRegistry.js           SIGNAL_REGISTRY catalogue (metadata for all signals)
│   └── alertLevel.js               computeAlertLevel() → CALM / WATCH / STORM / SIGNAL_LOST
├── pages/                          Route-level page components
├── services/
│   ├── api/                        HTTP clients per data source
│   └── normalizers/                Raw → NormalizedSignal transformers
│       └── __tests__/              Vitest unit tests for normalizers
└── styles/
    ├── globals.css                 CSS resets and base rules
    └── theme.css                   CSS custom properties (tokens)
```

---

## Authentication

- **Provider**: DummyJSON (`POST https://dummyjson.com/auth/login`)
- **Storage**: `localStorage["helios_auth"]` — `{ user, accessToken }`
- **Guard**: `ProtectedRoute` in the React Router tree redirects to `/login` if no `accessToken`
- **Scope**: All routes except `/login` are protected
- **Test credentials**: `emilys` / `emilyspass`

---

## Dashboard Persistence

Widget configuration (enabled state + order) persists independently from auth under `localStorage["helios-deck:dashboard-config"]`. New widgets added to `WIDGET_REGISTRY` in `constants.js` appear automatically with their default enabled state; the persisted config is **merged, not replaced**.

---

## CORS Strategy

| Source | Dev | Production |
|---|---|---|
| wheretheiss.at | Direct fetch | Direct fetch |
| NOAA SWPC | Vite proxy `/api/noaa` | Direct (verify) |
| NASA DONKI | Vite proxy `/api/nasa` | Direct (verify) |
| DummyJSON | Direct fetch | Direct fetch |

---

## Caching & Polling

Each signal has independently tuned `staleTime` and `refetchInterval`:

| Signal | staleTime | refetchInterval |
|---|---|---|
| ISS Position | 4 s | 5 s |
| Kp Index | 3 min | 5 min |
| Solar Flares | 30 min | (none — manual) |

Multiple components displaying the same signal share one cache entry — zero duplicate network requests.

---

## Deployment

- **Host**: Vercel (Static SPA)
- **Routing**: `vercel.json` rewrites all paths to `index.html` (React Router handles client-side navigation)
- **Build**: `npm run build` → Vite bundles to `dist/`
- **Env**: `VITE_NASA_API_KEY` — falls back to `DEMO_KEY` if unset

---

## Testing

Vitest (v2) is configured via `vite.config.js` (`test: { globals: true, environment: "node" }`). Unit tests cover all three normalizers at `src/services/normalizers/__tests__/`.

Run tests:
```bash
npm test          # single run
npm run test:watch  # watch mode
```
