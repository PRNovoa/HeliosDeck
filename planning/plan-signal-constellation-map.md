# Signal Constellation Map Plan

## Goal

The Signal Constellation Map is a HELIOS DECK product visualization for
`/signals`. It is not a real astronomy sky atlas. Its job is to make the signal
catalogue feel meaningful at a glance by showing how the app's geophysical and
heliophysical feeds relate to one another.

The map prioritizes signal flow:

1. Solar activity starts the chain.
2. Plasma conditions carry the activity through near-Earth space.
3. Geomagnetic signals and operational alerts show the impact layer.
4. ISS position remains separate orbital context.

## Visual Intent

The first implementation looked like a beige webpage card and made the nodes
feel like normal UI pills. The redesigned version is intentionally darker and
closer to the rest of HELIOS DECK:

- dark navy glass panel
- subtle stellar grid and star points
- thin constellation lines
- compact glowing nodes
- cyan for operational/live feed energy
- amber for solar-source activity
- visible text status so meaning does not rely only on color

The design should feel like a dashboard display, not a decorative landing-page
illustration.

## How The Map Is Made

The component lives at:

`src/components/visualizations/SignalConstellationMap.jsx`

It uses `SIGNAL_REGISTRY` as the source of truth for:

- signal id
- label
- provider
- source label
- status
- unit
- cadence
- route
- related signals

The map does not call APIs and does not duplicate live data. It only visualizes
the registry.

Implementation structure:

- `registryById` is built from `SIGNAL_REGISTRY`.
- Unique SVG edges are generated from each signal's `relatedSignals`.
- `NODE_POSITIONS` gives every signal a fixed x/y coordinate.
- `SIGNAL_ZONE` assigns each signal to a readable product zone.
- `SIGNAL_MEANING` explains why the selected signal matters.
- Hover and keyboard focus set `activeId`.
- Related signals are computed in both directions, so incoming and outgoing
  relations are highlighted.
- Clicking a node uses the existing React Router `Link` and `signal.route`.

## Signal Zones

Solar source:

- Solar Radio Flux
- Solar Flares
- Solar Radiation
- CME Events

Plasma transit:

- Solar Wind Speed
- Solar Wind Density

Geomagnetic impact:

- Kp Index
- Aurora Oval
- Space Weather Alerts

Orbital context:

- ISS Position

## Interaction Behavior

When the user hovers or focuses a signal:

- the active node lifts and glows
- related nodes remain bright
- unrelated nodes dim
- related edges brighten
- the interpretation panel updates with signal details

The interpretation panel shows:

- signal zone
- label
- provider
- source
- unit
- cadence
- relation count
- a short explanation of why the signal matters
- links to connected signals

## Accessibility

The map keeps the existing table as the accessible catalogue below the visual
overview.

Accessibility requirements:

- every node is a keyboard-focusable `Link`
- focus rings are visible
- status is shown as text, not only color
- connected signal chips are real links
- a screen-reader summary explains the map zones

## Verification Checklist

- `/signals` renders the constellation above the existing signal table.
- Hovering a signal highlights meaningful related nodes and edges.
- Keyboard focus triggers the same interpretation behavior.
- Clicking a node navigates to the existing signal route.
- The table and filters still work.
- `npm run build` passes.
- `npm run lint` passes.
- `npm run test` passes.
