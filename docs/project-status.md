# Helios Deck - Project Status

_Last updated: May 6, 2026_

## Signal Implementation Status

| Signal | Topic | Source | Status | Normalizer | Hook | Widget | Page |
|---|---|---|---|---|---|---|---|
| ISS Position | ORBIT | wheretheiss.at | LIVE | `normalizeISS.js` | `useISSPosition.js` | `IssPositionWidget` | `ISSPage` |
| Kp Index | GEOMAGNETIC | NOAA SWPC | LIVE | `normalizeKpIndex.js` | `useKpIndex.js` | `KpIndexWidget` | `KpIndexPage` |
| Solar Flares | SOLAR | NASA DONKI | LIVE_WITH_KEY | `normalizeSolarFlare.js` | `useSolarFlares.js` | `SolarFlareWidget` + chart | `SolarFlaresPage` |
| Space Weather Alerts | GEOMAGNETIC | NOAA SWPC | LIVE | `normalizeSpaceWeatherAlert.js` | `useSpaceWeatherAlerts.js` | `SpaceWeatherAlertsWidget` | Signals catalogue |
| Solar Wind Speed | PLASMA | NOAA SWPC | LIVE | `normalizeSolarWind.js` | `useSolarWind.js` | `SolarWindWidget` | `SolarWindPage` |
| Solar Wind Density | PLASMA | NOAA SWPC | LIVE | Included inside `normalizeSolarWind.js` | `useSolarWind.js` | `SolarWindDensityWidget` | `SolarWindPage` |
| Solar Radio Flux | SOLAR | NOAA SWPC | LIVE | `normalizeSolarRadioFlux.js` | `useSolarRadioFlux.js` | `SolarRadioFluxWidget` | Signals catalogue |
| CME Events | HELIOSPHERIC | NASA DONKI | LIVE_WITH_KEY | `normalizeCME.js` | `useCME.js` | `CMEWidget` | `CMEPage` |
| Aurora Oval | GEOMAGNETIC | NOAA SWPC | LIVE | `normalizeAurora.js` | `useAurora.js` | `AuroraWidget` | `AuroraPage` |
| GOES X-Ray Flux | RADIATION | NOAA SWPC | LIVE | `normalizeSolarRadiation.js` | `useSolarRadiation.js` | `SolarRadiationWidget` | `SolarRadiationPage` |

## Remaining External Constraints

- NASA DONKI feeds depend on NASA API quota. `DEMO_KEY` can return `OVER_RATE_LIMIT`; the widgets show this as a quota/key state instead of a broken signal.
- NOAA CORS should still be verified on the deployed production host. Local development uses the Vite NOAA proxy.

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Router (`createBrowserRouter`) | Complete | React Router v7; `/` and `/dashboard` render the dashboard |
| DummyJSON auth + ProtectedRoute | Complete | User session persisted in localStorage |
| Dashboard widget config | Complete | Per-user localStorage persistence, react-grid-layout drag/resize |
| Signal registry catalogue | Complete | `signalRegistry.js` is the source of truth |
| NormalizedSignal contract | Complete | Shared eight-field contract documented in `normalizedSignal.js` |
| React Query hooks | Complete | All live widgets use hooks; no widget fetches directly |
| Alert level system | Complete | Uses Kp, flares, NOAA alerts, and solar wind |
| SignalsPage catalogue | Complete | Filters by ALL, LIVE, PENDING, NASA, NOAA, ISS |
| Signal detail pages | Complete | ISS, Kp, flares, CME, solar wind, aurora, GOES X-ray, and shared catalogue views |
| Vitest normalizer tests | Complete | Pure normalizer coverage for all implemented normalizers, no network calls |
| Vercel readiness audit | Complete | Local build/lint/test, production preview smoke routes, and provider endpoint checks passed |
