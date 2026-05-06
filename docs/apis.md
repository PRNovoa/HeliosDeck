# API Status Inventory — HELIOS DECK

| Signal | Source | Base URL | Auth | CORS | Proxy | Normalizer | Hook |
|---|---|---|---|---|---|---|---|
| ISS Position | wheretheiss.at | `https://api.wheretheiss.at/v1/satellites/25544` | None | ✅ Free | No | `normalizeISS.js` | `useISSPosition.js` |
| Kp Index | NOAA SWPC | `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json` | None | ⚠️ Varies | `/api/noaa` | `normalizeKpIndex.js` | `useKpIndex.js` |
| Solar Flares | NASA DONKI | `https://api.nasa.gov/DONKI/FLR` | `api_key` | ✅ (with key) | `/api/nasa` | `normalizeSolarFlare.js` | `useSolarFlares.js` |
| CME Events | NASA DONKI | `https://api.nasa.gov/DONKI/CME` | `api_key` | ✅ (with key) | `/api/nasa` | _pending_ | _pending_ |
| Solar Wind | NOAA SWPC | `https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json` | None | ⚠️ Varies | `/api/noaa` | _pending_ | _pending_ |
| Aurora Oval | NOAA SWPC | `https://services.swpc.noaa.gov/json/ovation_aurora_latest.json` | None | ⚠️ Varies | `/api/noaa` | _pending_ | _pending_ |
| Solar Radiation | NOAA SWPC | `https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json` | None | ⚠️ Varies | `/api/noaa` | _pending_ | _pending_ |

## Notes

- **DEMO_KEY** (NASA): 30 requests/hour, 50/day. Get a free key at https://api.nasa.gov for higher limits.
- **CORS ⚠️**: NOAA SWPC endpoints vary by environment. The Vite dev proxy (`/api/noaa`) handles this in development. For production, verify CORS or add Vercel rewrites.
- **Vite proxy config**: Defined in `vite.config.js` under `server.proxy`.
- **Env var**: Set `VITE_NASA_API_KEY` in `.env.local` (copy from `.env.example`).

## Data Update Frequencies

| Signal | Refresh Rate | staleTime | Notes |
|---|---|---|---|
| ISS Position | 5 s | 4 s | Position changes ~7.66 km/s |
| Kp Index | 5 min | 3 min | NOAA updates every 3 min |
| Solar Flares | 30 min | 30 min | Event list, not streaming |
| Solar Wind | 1 min | — | NOAA 1-day plasma file |

## Signal Relationships

| Signal | Correlated With | Physical Reason |
|---|---|---|
| Solar Flares | Kp Index | X/M-class flares inject energetic particles that perturb the magnetosphere |
| Solar Flares | CME Events | Flares often co-erupt with CMEs from the same active region |
| CME Events | Kp Index | CME arrival drives geomagnetic storms (Dst index drops) |
| CME Events | Aurora Oval | Elevated Kp from CME impact expands the auroral oval to lower latitudes |
| Solar Wind | Kp Index | High solar wind speed and southward Bz drive geomagnetic activity |
| Solar Wind | Aurora Oval | Solar wind pressure and speed directly modulate the Ovation aurora model |
