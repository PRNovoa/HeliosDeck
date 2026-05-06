# Vercel Readiness Audit Report

## Overall Status

`READY WITH WARNINGS`

HELIOS DECK is locally ready to upload to Vercel. The build, lint, tests,
production preview routing, API pipeline, docs, and SPA rewrite all pass local
checks.

Warnings are not blockers:

- Vite reports a large JavaScript chunk after minification.
- Production provider CORS can only be fully confirmed after a deployed Vercel
  URL exists.
- `VITE_NASA_API_KEY` must be added in Vercel project settings for reliable
  NASA DONKI quota.

## Pass/Fail Summary

| Area | Status | Notes |
|---|---|---|
| Build | PASS | `npm run build` completed successfully and emitted `dist`. |
| Lint | PASS | `npm run lint` completed successfully. |
| Tests | PASS | `npm run test` completed successfully: 9 files, 43 tests. |
| Vercel config | PASS | `vercel.json` rewrites all paths to `/index.html`. |
| SPA routing | PASS | Local production preview returned `200` for all smoke routes. |
| Git ignore | PASS | `node_modules`, `dist`, and `*.local` are ignored. |
| Env safety | PASS | `.env.local` exists locally but is not tracked by Git. |
| API architecture | PASS | No UI/page/widget/direct feature fetches found; network calls stay in services. |
| API health | PASS | ISS, NOAA, and NASA DONKI with local key returned `200`. |
| Docs | PASS | README/docs include demo login, env notes, API scope, and Vercel note. |
| Bundle size | WARNING | Vite chunk-size warning is non-blocking. |
| Deployed CORS | WARNING | Local endpoint checks pass; final browser CORS check needs deployed URL. |

## Commands Run

```bash
npm run build
npm run lint
npm run test
```

Results:

- Build: PASS
- Lint: PASS
- Tests: PASS

Build warning:

```txt
Some chunks are larger than 500 kB after minification.
```

This is expected for the current single-bundle Vite app and is not a deployment
blocker.

## Local Preview Smoke Test

Local production preview routes checked:

- `/login`
- `/`
- `/dashboard`
- `/signals`
- `/signals/iss`
- `/signals/kp-index`
- `/signals/solar-flares`
- `/signals/solar-wind`
- `/signals/cme`
- `/signals/aurora`
- `/signals/solar-radiation`
- `/about`

All returned `HTTP 200` and included the React app root.

## Provider Endpoint Health

| Provider Feed | Result |
|---|---|
| ISS Position | PASS - HTTP 200 |
| NOAA Kp | PASS - HTTP 200 |
| NOAA Alerts | PASS - HTTP 200 |
| NOAA Solar Wind | PASS - HTTP 200 |
| NOAA Aurora | PASS - HTTP 200 |
| NOAA GOES X-ray | PASS - HTTP 200 |
| NOAA F10.7 | PASS - HTTP 200 |
| NASA DONKI FLR with local key | PASS - HTTP 200 |
| NASA DONKI CME with local key | PASS - HTTP 200 |

## Recommended Fix Plan

P0 - must fix before Vercel:

- None found.

P1 - strongly recommended before production use:

- Add `VITE_NASA_API_KEY` in Vercel project environment variables for
  Production, Preview, and Development.
- After first Vercel deploy, open the deployed site and confirm NOAA/NASA calls
  work from the browser, not only from local endpoint checks.

P2 - optional polish:

- Consider route-level code splitting later to remove the Vite large chunk
  warning.
- Consider updating user-facing copy from `solar-radiation` route naming to
  `goes-xray-flux` in a future breaking route cleanup. Keep the current route
  for now to avoid unnecessary router churn before delivery.

## Vercel Settings

Use these settings:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variable:

```txt
VITE_NASA_API_KEY=<NASA Open APIs key>
```
