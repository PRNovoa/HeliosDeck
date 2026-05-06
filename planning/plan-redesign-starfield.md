# HELIOS DECK — Starfield Constellation Redesign Plan

## Objective

Full visual overhaul from pixel/8-bit NES aesthetic to a sleek dark glassmorphism space dashboard inspired by **Starfield's Constellation faction** — a dark, scientific, high-precision mission control aesthetic.

### Reference Design

- Deep navy/void backgrounds with glassmorphism cards
- Amber (#f59e0b) as primary accent (Constellation gold)
- Cyan (#22d3ee) for geophysical/ISS data
- Animated constellation canvas (stars + connecting lines)
- Space Grotesk body font + JetBrains Mono for data
- Framer Motion animations: login stagger, page transitions, dashboard grid entrance, sidebar pill

---

## User Decisions (confirmed via Q&A)

| Question                    | Answer                                 |
| --------------------------- | -------------------------------------- |
| Full replacement vs hybrid? | Full replacement                       |
| Which widgets to restyle?   | Existing 3 only (ISS, KP, SolarFlare)  |
| Icon library?               | Lucide React                           |
| Profile in sidebar?         | Yes, use logged-in DummyJSON user data |

---

## Design Tokens (theme.css)

| Token                  | Value                      |
| ---------------------- | -------------------------- |
| `--color-bg-primary`   | `#07090f`                  |
| `--color-bg-card`      | `rgba(12,16,28,0.85)`      |
| `--color-accent-amber` | `#f59e0b`                  |
| `--color-accent-cyan`  | `#22d3ee`                  |
| `--color-accent-green` | `#22c55e`                  |
| `--color-accent-red`   | `#ef4444`                  |
| `--font-body`          | `"Space Grotesk"`          |
| `--font-mono`          | `"JetBrains Mono"`         |
| `--sidebar-width`      | `15rem`                    |
| `--card-backdrop`      | `blur(12px) saturate(1.4)` |

---

## New Components Created

### `src/components/layout/Sidebar.jsx`

Persistent vertical nav. Features:

- Observatory branding block ("HELIOS OPS / DECK-01")
- User profile area: DummyJSON avatar + name from `useAuth()`
- Nav items with Lucide icons (LayoutDashboard, Radio, etc.)
- Disabled items (BarChart2, Bell, Database, Archive, Settings)
- Framer Motion `layoutId="sidebar-pill"` active indicator

### `src/components/layout/TopBar.jsx`

Sticky horizontal bar. Features:

- Logo (◆ HELIOS DECK)
- Center nav tabs (Dashboard, Signals, Analysis disabled, About)
- Right: system status badge, live UTC clock (1s interval), action icons

### `src/components/ui/DashboardCard.jsx`

Replaces PixelCard. Features:

- Glassmorphism card with `--card-accent-color` top border
- `motion.div` with `whileHover` scale on hover
- Drag handle (⠿), title, MoreHorizontal menu, Maximize2 expand (hover)
- `title`, `accent`, `headerRight`, `children`, `className` props

### `src/components/ui/ConstellationBackground.jsx`

HTML5 Canvas animation. Features:

- 75 animated nodes, `MAX_DIST=140`, `SPEED=0.25`
- Connecting lines at `rgba(180,210,255,alpha)`
- `ResizeObserver` for responsive sizing
- `pointer-events: none`, `position: absolute`

---

## Modified Pages & Components

### `src/pages/LoginPage.jsx`

Full rewrite with Framer Motion:

- `ConstellationBackground` fills entire page
- Radial gradient overlay (cyan top, amber bottom-left)
- Logo + card enter with staggered animations
- Form fields animate individually with `staggerChildren: 0.08`
- Error: `AnimatePresence` animated height reveal
- Button: `whileHover` scale + `whileTap` press

### `src/components/layout/Shell.jsx`

Updated layout: Sidebar + TopBar + AnimatePresence `<Outlet />` for page transitions (y:10→0 on enter, y:-6 fade on exit).

### `src/features/dashboard/DashboardGrid.jsx`

Added Framer Motion stagger: cells animate in sequence with `staggerChildren: 0.07`.

### `src/features/dashboard/MissionControlHeader.jsx`

Modern mission control strip: left (title + alert pill), center (stats counters), right (configure button).

---

## Widget Restyling

### IssPositionWidget

- Map-style dark `mapBg` with spinning dashed orbit rings
- Cyan ISS marker with glow
- Live tracking badge (green pulsing dot)
- 2×2 data grid: LAT, LON, ALTITUDE, VELOCITY

### KpIndexWidget

- SVG semicircular gauge: 280° sweep from 7-o'clock
- Arc coloured by `kpColourVar(kp)`, with glow drop-shadow
- Tick marks at each integer 0–9
- Center overlay: large mono Kp value + storm level label
- DETAILS → link to `/signals/kp-index`

### SolarFlareWidget

- Hero display: large class type (e.g. "M2.4") + description
- Stats row: PEAK time + DURATION
- X-Ray Flux proxy bar (X=100%, M=72%, C=40%, B=20%, A=8%)
- ACTIVE badge when `!value.endTime`
- VIEW EVENTS → link to `/signals/solar-flares`

---

## Pages Restyled (light touch)

- `SignalsPage.module.css` — replaced pixel font refs, updated borders/colors to new tokens
- `AboutPage.module.css` — replaced pixel font/color refs, updated table/stack/ascii styles
- `ComingSoonPage.module.css` — updated header accent, chip/badge styles, border tokens

---

## Libraries Added

| Library         | Version | Purpose                                                                   |
| --------------- | ------- | ------------------------------------------------------------------------- |
| `framer-motion` | 12.38.0 | Login stagger, page transitions, sidebar pill, dashboard grid, card hover |
| `lucide-react`  | latest  | Icons in Sidebar and TopBar                                               |

---

## Completion Status

- [x] theme.css & globals.css full rewrite
- [x] Sidebar component
- [x] TopBar component
- [x] Shell layout (sidebar + topbar + page transitions)
- [x] ConstellationBackground canvas animation
- [x] DashboardCard component
- [x] LoginPage (Framer Motion stagger + constellation bg)
- [x] DashboardGrid (stagger entrance)
- [x] MissionControlHeader (modern strip)
- [x] IssPositionWidget (orbit visual + data grid)
- [x] KpIndexWidget (SVG arc gauge)
- [x] SolarFlareWidget (hero card)
- [x] SignalsPage restyle
- [x] AboutPage restyle
- [x] ComingSoonPage restyle
