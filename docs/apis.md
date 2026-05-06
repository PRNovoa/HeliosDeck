# API Status Inventory - HELIOS DECK

| API | Provider | Signal | Auth | CORS | Status | Hook | Normalizer | Widget |
|---|---|---|---|---|---|---|---|---|
| Where The ISS At | wheretheiss.at | ISS Position | None | Free | LIVE | `useISSPosition.js` | `normalizeISS.js` | `IssPositionWidget` |
| NOAA Planetary K Index | NOAA SWPC | Kp Index | None | Verify prod | LIVE | `useKpIndex.js` | `normalizeKpIndex.js` | `KpIndexWidget` |
| NASA DONKI FLR | NASA DONKI | Solar Flares | `VITE_NASA_API_KEY` optional | Dev proxy, direct prod | LIVE_WITH_KEY | `useSolarFlares.js` | `normalizeSolarFlare.js` | `SolarFlareWidget` |
| NOAA Alerts | NOAA SWPC | Space Weather Alerts | None | Verify prod | LIVE | `useSpaceWeatherAlerts.js` | `normalizeSpaceWeatherAlert.js` | `SpaceWeatherAlertsWidget` |
| NOAA Solar Wind Plasma | NOAA SWPC | Solar Wind Speed/Density | None | Verify prod | LIVE | `useSolarWind.js` | `normalizeSolarWind.js` | `SolarWindWidget` |
| NOAA F10.7 Solar Radio Flux | NOAA SWPC | Solar Radio Flux | None | Verify prod | LIVE | `useSolarRadioFlux.js` | `normalizeSolarRadioFlux.js` | `SolarRadioFluxWidget` |
| NASA DONKI CME | NASA DONKI | CME Events | `VITE_NASA_API_KEY` optional | Dev proxy, direct prod | LIVE_WITH_KEY | `useCME.js` | `normalizeCME.js` | `CMEWidget` |
| NOAA Ovation Aurora | NOAA SWPC | Aurora Oval | None | Verify prod | LIVE | `useAurora.js` | `normalizeAurora.js` | `AuroraWidget` |
| NOAA GOES X-ray Flux | NOAA SWPC | GOES X-Ray Flux | None | Verify prod | LIVE | `useSolarRadiation.js` | `normalizeSolarRadiation.js` | `SolarRadiationWidget` |

## NASA API Key

`VITE_NASA_API_KEY` is optional. The app falls back to `DEMO_KEY`, which works for NASA Open APIs but has lower rate limits.

Frontend Vite environment variables are public in the final JavaScript bundle. Do not treat `VITE_NASA_API_KEY` as a secret.

## CORS Notes

- Vite dev proxy routes are defined in `vite.config.js`.
- `/api/nasa` proxies to `https://api.nasa.gov` during local development.
- `/api/noaa` proxies to `https://services.swpc.noaa.gov` during local development.
- Production uses direct provider URLs. NOAA production CORS should be verified on the deployed host, so NOAA entries are marked `VERIFY_PROD` in docs even when the local/proxied implementation is live.
- HELIOS DECK does not silently fake live data. NASA DONKI feeds show quota/key messages when `DEMO_KEY` is rate-limited.

## Data Update Frequencies

| Signal | Refresh Rate | staleTime | Notes |
|---|---:|---:|---|
| ISS Position | 5 s | 4 s | Position changes continuously |
| Kp Index | 5 min | 3 min | NOAA planetary K index product; provider index updates are reflected through SWPC product refreshes |
| Solar Flares | On view / cached | 30 min | DONKI event list for the selected day range |
| Space Weather Alerts | 5 min | 5 min | Watches, warnings, alerts and summaries |
| Solar Wind | 2 min | 1 min | NOAA 1-day plasma file |
| Solar Radio Flux | 1 h | 1 h | F10.7 observations update a few times daily |
| GOES X-Ray Flux | 2 min | 1 min | GOES primary XRS samples filtered to the long channel |

## Signal Relationships

| Signal | Correlated With | Physical Reason |
|---|---|---|
| Solar Flares | Kp Index | X/M-class flares can precede geomagnetic disturbance |
| Solar Flares | CME Events | Flares often co-erupt with CMEs from the same active region |
| Space Weather Alerts | Kp Index / Solar Wind | NOAA alerts summarize operational storm thresholds and watches |
| Solar Wind | Kp Index | High solar wind speed and southward IMF can drive geomagnetic activity |
| Solar Wind | Aurora Oval | Solar wind pressure and speed modulate auroral activity |
| Solar Radio Flux | Solar Flares / Radiation | F10.7 cm flux is a solar activity proxy |
