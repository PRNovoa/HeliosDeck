# HELIOS DECK - Geophysical & Heliophysical Observatory

HELIOS DECK is a front-end scoped React/Vite dashboard for public orbital and space-weather feeds. It aggregates ISS telemetry, NOAA geomagnetic data, NOAA operational alerts, NASA DONKI solar flare events, and NOAA solar plasma/radio flux products, then normalizes them into one shared signal contract before rendering.

## Stack

- React 19 + Vite
- React Router v7 with `createBrowserRouter`
- TanStack React Query v5 for server state
- Tailwind CSS v4
- Recharts
- Framer Motion / Motion animations
- DummyJSON auth
- DashboardContext + localStorage + react-grid-layout
- JavaScript only

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Demo login:

```txt
username: emilys
password: emilyspass
```

## Environment Variables

Copy `.env.example` to `.env.local` if you want a NASA key:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `VITE_NASA_API_KEY` | `DEMO_KEY` | Optional NASA Open APIs key for DONKI. `DEMO_KEY` works but has lower rate limits. |
| `VITE_USE_MOCKS` | `false` | Reserved mock flag if fixtures are enabled later. |

Frontend Vite env vars are public in the final bundle. Do not treat `VITE_NASA_API_KEY` as a secret.

## API Scope

| Signal | Provider | Status |
|---|---|---|
| ISS Position | wheretheiss.at | LIVE |
| Kp Index | NOAA SWPC | LIVE |
| Solar Flares | NASA DONKI | LIVE_WITH_KEY |
| Space Weather Alerts | NOAA SWPC | LIVE |
| Solar Wind Speed/Density | NOAA SWPC | LIVE |
| Solar Radio Flux | NOAA SWPC | LIVE |
| CME Events | NASA DONKI | LIVE_WITH_KEY |
| Aurora Oval | NOAA SWPC | LIVE |
| GOES X-Ray Flux | NOAA SWPC | LIVE |

See [docs/apis.md](docs/apis.md) for endpoint, CORS, hook, normalizer, and widget details.

## Data Architecture

Every live API follows the same pipeline:

```txt
React Query hook
-> API client
-> normalizer
-> NormalizedSignal or NormalizedSignal[]
-> widget/page
```

UI components and pages do not fetch directly. Network calls stay in `src/services/api`, provider payload parsing stays in `src/services/normalizers`, and widgets consume normalized data through hooks.

## Project Structure

```txt
src/
  app/                 router and route constants
  components/
    layout/            Shell, ProtectedRoute, SignalPageLayout
    ui/                shared cards, loading, errors, badges
    widgets/           dashboard widgets
  context/             auth and dashboard state
  features/dashboard/  dashboard grid and controls
  hooks/               React Query hooks
  lib/                 constants, registry, query client, formatters
  pages/               route pages
  services/
    api/               HTTP clients
    normalizers/       raw provider data -> NormalizedSignal
  styles/              Tailwind and theme CSS
```

## Commands

```bash
npm run dev
npm run build
npm run test
npm run lint
```

## Vercel Note

`vercel.json` rewrites all routes to `index.html` for SPA routing. Local development uses Vite proxies for NASA and NOAA; production uses direct provider URLs, so NOAA CORS should be verified after deployment.

## License

MIT
