# Helios Deck — Project Status

_Last updated: see git log_

---

## Signal Implementation Status

| Signal | Topic | Source | Status | Normalizer | Hook | Widget | Page |
|---|---|---|---|---|---|---|---|
| ISS Position | ORBIT | wheretheiss.at | ✅ LIVE | normalizeISS.js | useISSPosition.js | IssPositionWidget | ISSPage |
| Kp Index | GEOMAGNETIC | NOAA SWPC | ✅ LIVE | normalizeKpIndex.js | useKpIndex.js | KpIndexWidget | KpIndexPage |
| Solar Flares | SOLAR | NASA DONKI | ✅ LIVE | normalizeSolarFlare.js | useSolarFlares.js | SolarFlareWidget + Chart | SolarFlaresPage |
| CME Events | HELIOSPHERIC | NASA DONKI | ⏳ PENDING | — | — | — | ComingSoonPage |
| Solar Wind Speed | PLASMA | NOAA SWPC | ⏳ PENDING | — | — | — | ComingSoonPage |
| Solar Wind Density | PLASMA | NOAA SWPC | ⏳ PENDING | — | — | — | ComingSoonPage |
| Aurora Oval | GEOMAGNETIC | NOAA SWPC | ⏳ PENDING | — | — | — | ComingSoonPage |
| Solar Radiation | RADIATION | NOAA SWPC | ⏳ PENDING | — | — | — | ComingSoonPage |

---

## Pending Signal Blockers

### CME Events
- **Blocker**: CME analysis time fields are complex (multiple instruments, speed estimates per model)
- **Next step**: Create `normalizeCME.js`, `fetchCME` client call, `useCME` hook, and `CMEWidget`

### Solar Wind Speed / Density
- **Blocker**: NOAA SWPC CORS in production environment unverified
- **Next step**: Verify NOAA SWPC CORS on Vercel production, then create `normalizeSolarWind.js` and `SolarWindWidget`

### Aurora Oval
- **Blocker**: Ovation aurora JSON is a large geospatial lat/lon grid requiring a map projection component
- **Next step**: Evaluate lightweight canvas/SVG world map approach, then create `normalizeAurora.js`

### Solar Radiation
- **Blocker**: GOES X-ray flux data is a high-frequency time series requiring a Recharts `LineChart`
- **Next step**: Create `normalizeRadiation.js` and `RadiationChart`

---

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Router (createBrowserRouter) | ✅ Complete | React Router v7 |
| DummyJSON auth + ProtectedRoute | ✅ Complete | localStorage session |
| Dashboard widget config | ✅ Complete | localStorage persistence, merge strategy |
| Signal registry catalogue | ✅ Complete | `signalRegistry.js` — single source of truth |
| NormalizedSignal contract | ✅ Complete | `normalizedSignal.js` JSDoc typedef |
| Alert level system | ✅ Complete | CALM / WATCH / STORM / SIGNAL_LOST |
| MissionControlHeader | ✅ Complete | Live alert, widget count, last sync |
| SignalPageLayout | ✅ Complete | Shared header for all signal pages |
| JsonInspector | ✅ Complete | Raw signal viewer on all signal pages |
| SolarFlareSeverityChart | ✅ Complete | Recharts BarChart, coloured by class |
| SignalsPage catalog | ✅ Complete | Filter buttons, full table from registry |
| ComingSoonPage (rich) | ✅ Complete | Shows pendingReason, nextStep, API endpoint |
| Vitest normalizer tests | ✅ Complete | 11 tests across 3 normalizers |
| Docs (architecture.md) | ✅ Complete | |
| Docs (project-status.md) | ✅ Complete | |
