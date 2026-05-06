# Plan de Setup del Sistema — HELIOS DECK

> Observatorio Cósmico de Datos Geofísicos  
> Fecha: Mayo 2026

---

## Resumen ejecutivo

Este documento recoge todas las decisiones de arquitectura, restricciones tecnológicas y pasos ejecutados para construir la base funcional completa del proyecto **HELIOS DECK** antes de empezar el desarrollo de features. El objetivo era tener un entorno listo para desarrollar sin fricción: proyecto arrancando, rutas funcionando, estilos aplicados y datos reales llegando a los widgets.

---

## 1. Restricciones técnicas (no negociables)

| Restricción                         | Motivo                                                   |
| ----------------------------------- | -------------------------------------------------------- |
| Sin TypeScript                      | El proyecto es JavaScript puro (`.jsx` / `.js`)          |
| Sin `createBrowserRouter`           | Sólo API declarativa: `BrowserRouter`, `Routes`, `Route` |
| Sin SSR / framework mode            | SPA estática, desplegable en cualquier CDN               |
| Sin Zustand ni Redux                | Estado global sólo vía React Context + `useReducer`      |
| Sin `loaders` / `actions` de Router | La carga de datos es responsabilidad de TanStack Query   |
| Sin backend propio                  | Todos los datos vienen de APIs públicas externas         |
| Sin dnd-kit                         | El reorder de widgets se gestiona con índices en Context |

---

## 2. Stack elegido

| Capa                  | Tecnología                      | Versión         |
| --------------------- | ------------------------------- | --------------- |
| Framework UI          | React                           | 19              |
| Build tool            | Vite                            | 8               |
| Routing               | React Router DOM                | 6 (declarativo) |
| Data fetching / cache | TanStack Query                  | 5               |
| Gráficos              | Recharts                        | latest          |
| Estilos               | CSS Modules + Custom Properties | —               |
| Fuente                | Press Start 2P                  | Google Fonts    |
| Despliegue            | Vercel (SPA rewrite)            | —               |

---

## 3. Estructura de directorios

```
src/
├── app/
│   ├── routes.js          ← constantes de rutas
│   └── Providers.jsx      ← wrapper único de providers globales
├── components/
│   ├── layout/
│   │   ├── Shell.jsx      ← layout raíz (Navbar + Outlet + Footer)
│   │   └── Navbar.jsx     ← barra de navegación responsiva
│   └── ui/
│       ├── PixelCard.jsx
│       ├── Skeleton.jsx
│       ├── ErrorFallback.jsx
│       ├── EmptyState.jsx
│       ├── SourceBadge.jsx
│       └── LastUpdatedIndicator.jsx
├── context/
│   └── DashboardContext.jsx   ← config de widgets + localStorage
├── features/
│   └── dashboard/
│       ├── DashboardGrid.jsx
│       └── WidgetSelector.jsx
├── hooks/
│   ├── useISSPosition.js
│   ├── useKpIndex.js
│   └── useSolarFlares.js
├── lib/
│   ├── queryClient.js     ← instancia global de QueryClient
│   ├── constants.js       ← señales, fuentes, widgets, query keys
│   └── formatters.js      ← utilidades de formato puro
├── pages/
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   ├── SignalsPage.jsx
│   ├── ISSPage.jsx
│   ├── KpIndexPage.jsx
│   ├── SolarFlaresPage.jsx
│   ├── ComingSoonPage.jsx
│   ├── AboutPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   ├── api/
│   │   ├── issClient.js        ← wheretheiss.at
│   │   └── otherClients.js     ← NASA DONKI + NOAA SWPC
│   └── normalizers/
│       ├── normalizeISS.js
│       ├── normalizeKpIndex.js
│       └── normalizeSolarFlare.js
├── styles/
│   ├── theme.css          ← tokens CSS (colores, tipografía, spacing)
│   └── globals.css        ← reset + estilos base 8-bit
└── main.jsx               ← entrada: BrowserRouter + rutas + providers
```

---

## 4. Pasos de setup ejecutados

### 4.1 Scaffolding del proyecto

```bash
npm create vite@latest . -- --template react
```

- Nombre del paquete: `helios-deck`
- Template: `react` (sin TypeScript)

### 4.2 Instalación de dependencias

```bash
npm install react-router-dom @tanstack/react-query @tanstack/react-query-devtools recharts
```

### 4.3 Limpieza del scaffold de Vite

Archivos eliminados (no necesarios):

- `src/App.jsx`
- `src/App.css`
- `src/index.css`

### 4.4 `vite.config.js` — alias de ruta y proxies de API

```js
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
},
server: {
  proxy: {
    '/api/nasa':  { target: 'https://api.nasa.gov',               changeOrigin: true, rewrite: p => p.replace(/^\/api\/nasa/, '') },
    '/api/noaa':  { target: 'https://services.swpc.noaa.gov',     changeOrigin: true, rewrite: p => p.replace(/^\/api\/noaa/, '') },
  }
}
```

### 4.5 `index.html` — fuente 8-bit y metadatos

- Idioma: `lang="es"`
- Título: `HELIOS DECK`
- Google Fonts: `Press Start 2P` cargada en `<head>`
- `favicon.svg` referenciado en `/public/`

### 4.6 Sistema de diseño CSS

**`src/styles/theme.css`** — tokens CSS custom properties:

- Colores: `--color-space-void`, `--color-solar-gold`, `--color-geo-cyan`, `--color-kp-0…9`
- Tipografía: `--font-pixel` (Press Start 2P), `--font-mono` (Courier New)
- Espaciado: `--space-1` a `--space-16`
- Sombras: `--shadow-pixel-sm/md/lg`, variantes glow
- Layout: `--navbar-height: 3.5rem`, `--sidebar-width: 14rem`

**`src/styles/globals.css`** — estilos base:

- Reset CSS
- Body con fondo `space-void` y efecto scanline via `background-image`
- Tipografía jerárquica con fuente pixel
- Barra de scroll estilizada
- Animaciones: `blink`, `pulse-glow`, shimmer
- Clases utilitarias: `.pixel-border`, `.glow-*`, `.sr-only`

### 4.7 Librerías core (`src/lib/`)

**`queryClient.js`** — configuración global de TanStack Query:

```js
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000, // 10 min
      retry: 2,
      retryDelay: (n) => Math.min(1000 * 2 ** n, 30_000),
      refetchOnWindowFocus: false,
    },
  },
});
```

**`constants.js`** — fuente de verdad única:

- `SIGNAL` — 8 identificadores de señales
- `SOURCE` — endpoints de API
- `KP_LEVEL` — escala quiet → extreme
- `FLARE_CLASS` — clasificación de llamaradas
- `WIDGET_REGISTRY` — 7 definiciones de widgets con `defaultEnabled` y `defaultOrder`
- `DASHBOARD_STORAGE_KEY` — `'helios-deck:dashboard-config'`
- `QUERY_KEYS` — factory functions para las query keys

**`formatters.js`** — utilidades de formato puras (sin side-effects):

- `formatTimestamp(iso)` → fecha UTC legible
- `formatRelativeTime(iso)` → "5m ago"
- `formatLatLon(lat, lon)` → "48.32°N 23.11°W"
- `classifyKp(value)` → nivel KP_LEVEL
- `kpColourVar(value)` → string `var(--color-kp-N)`
- `flareClassSeverity(classType)` → número para ordenación

### 4.8 Context de dashboard (`src/context/DashboardContext.jsx`)

- Construye la configuración por defecto desde `WIDGET_REGISTRY`
- Fusiona la config guardada en `localStorage` al montar
- Persiste cada cambio vía `useEffect`
- Exports: `toggleWidget(id)`, `reorderWidgets(orderedIds)`, `resetConfig()`, `getSortedWidgets(onlyEnabled)`
- Hook: `useDashboard()`

### 4.9 Router y layout (`src/app/`, `src/components/layout/`)

- `routes.js` — objeto `ROUTES` con todas las rutas como constantes
- `Providers.jsx` — envuelve con `QueryClientProvider` + `DashboardProvider` + `ReactQueryDevtools`
- `Shell.jsx` — layout raíz: `<Navbar>` + `<main>` con `<Outlet>` + `<footer>`
- `Navbar.jsx` — navbar sticky, `NavLink` con estilos activos, menú hamburguesa en móvil

### 4.10 Clientes de API (`src/services/api/`)

**`issClient.js`** → `wheretheiss.at`

- `fetchISSPosition()` — NORAD 25544 en tiempo real
- `fetchISSPositionHistory(timestamps[])` — posiciones por timestamp

**`otherClients.js`** → NASA DONKI + NOAA SWPC

- Detecta entorno con `import.meta.env.DEV` para usar proxy o URL directa
- `VITE_NASA_API_KEY` con fallback `DEMO_KEY`
- `fetchSolarFlares({startDate, endDate})`
- `fetchCME({startDate, endDate})`
- `fetchSolarWind()`
- `fetchKpIndex()`

### 4.11 Normalizadores (`src/services/normalizers/`)

Todos transforman datos brutos de API → `NormalizedSignal`:

```js
{
  source: string,       // SOURCE constant
  fetchedAt: string,    // ISO 8601
  value: object|null,
  error: string|null,
}
```

- `normalizeISS(raw)` — valida, convierte Unix → ISO, mapea lat/lon/altitude/velocity/visibility
- `normalizeKpIndex(row)` — parsea fila NOAA `[timeTag, kp, status]`, clasifica nivel
- `normalizeSolarFlare(raw)` / `normalizeSolarFlareArray(arr)` — filtra errores, ordena por severidad desc

### 4.12 Hooks de TanStack Query (`src/hooks/`)

| Hook                   | Señal        | staleTime | refetchInterval |
| ---------------------- | ------------ | --------- | --------------- |
| `useISSPosition`       | ISS          | 4 s       | 5 s             |
| `useKpIndex`           | Kp Index     | 3 min     | 5 min           |
| `useSolarFlares(days)` | Solar Flares | 30 min    | —               |

### 4.13 Componentes UI (`src/components/ui/`)

Todos llevan su CSS Module asociado.

| Componente                   | Propósito                                         |
| ---------------------------- | ------------------------------------------------- |
| `PixelCard`                  | Tarjeta base con borde 8-bit y acento de color    |
| `Skeleton` / `SkeletonBlock` | Placeholders de carga con animación shimmer       |
| `ErrorFallback`              | Estado de error con botón retry y animación blink |
| `EmptyState`                 | Estado vacío centrado                             |
| `SourceBadge`                | Badge con fuente de datos coloreada               |
| `LastUpdatedIndicator`       | Timestamp relativo + indicador de fetching        |

### 4.14 Widgets (`src/components/widgets/`)

| Widget              | Hook             | Datos mostrados                                     |
| ------------------- | ---------------- | --------------------------------------------------- |
| `IssPositionWidget` | `useISSPosition` | Lat/Lon, Altitud, Velocidad, Visibilidad            |
| `KpIndexWidget`     | `useKpIndex`     | Valor Kp, nivel, barra gauge con color dinámico     |
| `SolarFlareWidget`  | `useSolarFlares` | Top 3 llamaradas: clase, ubicación, tiempo relativo |

### 4.15 Feature Dashboard (`src/features/dashboard/`)

- `DashboardGrid` — CSS Grid `auto-fill minmax(280px, 1fr)`, renderiza widgets habilitados
- `WidgetSelector` — lista de checkboxes para activar/desactivar widgets, botón de reset

### 4.16 Páginas (`src/pages/`)

| Ruta                       | Página            | Estado                                    |
| -------------------------- | ----------------- | ----------------------------------------- |
| `/`                        | `HomePage`        | Hero + grid de señales                    |
| `/dashboard`               | `DashboardPage`   | Grid de widgets + configurador colapsable |
| `/signals`                 | `SignalsPage`     | Catálogo de señales con badges de estado  |
| `/signals/iss`             | `ISSPage`         | Detalle ISS con widget                    |
| `/signals/kp-index`        | `KpIndexPage`     | Detalle Kp con widget                     |
| `/signals/solar-flares`    | `SolarFlaresPage` | Detalle llamaradas con widget             |
| `/signals/cme`             | `ComingSoonPage`  | Placeholder                               |
| `/signals/solar-wind`      | `ComingSoonPage`  | Placeholder                               |
| `/signals/aurora`          | `ComingSoonPage`  | Placeholder                               |
| `/signals/solar-radiation` | `ComingSoonPage`  | Placeholder                               |
| `/about`                   | `AboutPage`       | Info del proyecto + tabla de APIs         |
| `*`                        | `NotFoundPage`    | 404 con blink                             |

### 4.17 Punto de entrada (`src/main.jsx`)

```jsx
<StrictMode>
  <Providers>
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>{/* todas las rutas anidadas */}</Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Providers>
</StrictMode>
```

El import de `globals.css` se hace **una sola vez** aquí.

---

## 5. Archivos de configuración adicionales

| Archivo                            | Propósito                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `.env.example`                     | Plantilla de variables de entorno (`VITE_NASA_API_KEY`, `VITE_USE_MOCKS`) |
| `vercel.json`                      | Rewrite `/*` → `/index.html` para SPA                                     |
| `.vscode/extensions.json`          | Extensiones recomendadas (ESLint, Prettier, snippets)                     |
| `.vscode/settings.json`            | Format on save, default formatter Prettier                                |
| `.github/PULL_REQUEST_TEMPLATE.md` | Checklist de PR con restricciones del proyecto                            |
| `docs/apis.md`                     | Inventario de APIs: CORS, auth, frecuencia de actualización               |
| `public/favicon.svg`               | Icono pixel-art del sol                                                   |

---

## 6. Variables de entorno

```bash
# .env.local (no commitear)
VITE_NASA_API_KEY=tu_clave_aqui

# .env.example (sí commitear)
VITE_NASA_API_KEY=DEMO_KEY
VITE_USE_MOCKS=false
```

Obtener clave NASA gratuita: https://api.nasa.gov

---

## 7. Estado de las APIs

| Señal                       | CORS         | Clave               | Proxy Vite   |
| --------------------------- | ------------ | ------------------- | ------------ |
| ISS (`wheretheiss.at`)      | ✅ Libre     | No                  | No necesario |
| Kp Index (NOAA SWPC)        | ⚠️ Variable  | No                  | `/api/noaa`  |
| Solar Flares (NASA DONKI)   | ✅ Con clave | `VITE_NASA_API_KEY` | `/api/nasa`  |
| CME (NASA DONKI)            | ✅ Con clave | `VITE_NASA_API_KEY` | `/api/nasa`  |
| Solar Wind (NOAA SWPC)      | ⚠️ Variable  | No                  | `/api/noaa`  |
| Aurora (NOAA SWPC)          | ⚠️ Variable  | No                  | `/api/noaa`  |
| Solar Radiation (NOAA SWPC) | ⚠️ Variable  | No                  | `/api/noaa`  |

---

## 8. Resultado del build

```
✔ 133 modules transformed
dist/index.html          0.88 kB  │ gzip:  0.48 kB
dist/assets/index.css   22.46 kB  │ gzip:  4.35 kB
dist/assets/index.js   296.54 kB  │ gzip: 92.95 kB

✔ built in 469ms
```

---

## 9. Próximos pasos (features)

Una vez completado el setup, el orden sugerido de desarrollo es:

1. **Gráficos Recharts** — histórico de Kp, solar wind time-series
2. **CME hook + widget** — `useCME()` + `CMEWidget`
3. **Solar Wind hook + widget** — `useSolarWind()` + `SolarWindWidget`
4. **Aurora hook + widget** — `useAurora()` + mapa SVG de la oval
5. **Solar Radiation hook + widget** — `useSolarRadiation()` + gráfico GOES
6. **Reorder de widgets** — drag o botones up/down en `WidgetSelector`
7. **Modo offline / mock fixtures** — activado con `VITE_USE_MOCKS=true`
8. **Tests** — Vitest + Testing Library para normalizers y hooks
