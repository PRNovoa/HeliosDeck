# HELIOS DECK — Observatorio Cósmico de Datos Geofísicos

An 8-bit pixel-art cosmic dashboard displaying real-time geophysical and space weather data: ISS position, Kp index, solar flares, CME events, solar wind, aurora oval, and solar radiation.

## Stack

- **React 19 + Vite** — fast build, HMR
- **React Router DOM v6** — declarative `BrowserRouter` routing
- **TanStack Query v5** — all remote data fetching, caching, and auto-refresh
- **Recharts** — signal charts
- **CSS Modules + CSS Custom Properties** — 8-bit NES design system
- **Font**: Press Start 2P (Google Fonts)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and (optionally) add your NASA API key
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment Variables

| Variable            | Default    | Description                                               |
| ------------------- | ---------- | --------------------------------------------------------- |
| `VITE_NASA_API_KEY` | `DEMO_KEY` | NASA Open APIs key — get one free at https://api.nasa.gov |
| `VITE_USE_MOCKS`    | `false`    | Use local mock fixtures instead of real APIs              |

## Project Structure

```
src/
├── app/           # Router constants (routes.js) + Providers wrapper
├── components/
│   ├── layout/    # Shell, Navbar
│   └── ui/        # PixelCard, Skeleton, ErrorFallback, EmptyState, SourceBadge, LastUpdatedIndicator
├── context/       # DashboardContext (widget config + localStorage)
├── features/
│   └── dashboard/ # DashboardGrid, WidgetSelector
├── hooks/         # useISSPosition, useKpIndex, useSolarFlares
├── lib/           # queryClient, constants, formatters
├── pages/         # One file per route
├── services/
│   ├── api/       # HTTP clients (issClient, otherClients)
│   └── normalizers/  # Data → NormalizedSignal transforms
└── styles/        # theme.css (tokens), globals.css
```

## Available Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start Vite dev server with API proxies |
| `npm run build`   | Production build to `dist/`            |
| `npm run preview` | Preview production build locally       |

## Data Sources

| Signal          | Source         | Auth required  |
| --------------- | -------------- | -------------- |
| ISS Position    | wheretheiss.at | No             |
| Kp Index        | NOAA SWPC      | No             |
| Solar Flares    | NASA DONKI     | API key (free) |
| CME Events      | NASA DONKI     | API key (free) |
| Solar Wind      | NOAA SWPC      | No             |
| Aurora Oval     | NOAA SWPC      | No             |
| Solar Radiation | NOAA SWPC      | No             |

See [docs/apis.md](docs/apis.md) for full API status details.

## License

MIT

---

## Vite Notes

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
