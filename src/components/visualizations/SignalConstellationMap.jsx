import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SIGNAL, SOURCE } from "@/lib/constants.js";
import { SIGNAL_REGISTRY, SIGNAL_STATUS } from "@/lib/signalRegistry.js";

const MAP_WIDTH = 1120;
const MAP_HEIGHT = 620;

const NODE_POSITIONS = {
  [SIGNAL.SOLAR_RADIO_FLUX]: { x: 130, y: 275 },
  [SIGNAL.SOLAR_FLARE_EVENTS]: { x: 285, y: 190 },
  [SIGNAL.SOLAR_RADIATION]: { x: 285, y: 405 },
  [SIGNAL.CORONAL_MASS_EJECTIONS]: { x: 470, y: 285 },
  [SIGNAL.SOLAR_WIND_SPEED]: { x: 585, y: 430 },
  [SIGNAL.SOLAR_WIND_DENSITY]: { x: 390, y: 530 },
  [SIGNAL.KP_INDEX]: { x: 755, y: 390 },
  [SIGNAL.SPACE_WEATHER_ALERTS]: { x: 875, y: 265 },
  [SIGNAL.AURORAL_OVAL_PROBABILITY]: { x: 930, y: 495 },
  [SIGNAL.ISS_COORDINATES]: { x: 970, y: 150 },
};

const NODE_LABEL_SIDE = {
  [SIGNAL.SPACE_WEATHER_ALERTS]: "left",
  [SIGNAL.AURORAL_OVAL_PROBABILITY]: "left",
  [SIGNAL.ISS_COORDINATES]: "left",
};

const SIGNAL_ZONE = {
  [SIGNAL.SOLAR_RADIO_FLUX]: "Solar source",
  [SIGNAL.SOLAR_FLARE_EVENTS]: "Solar source",
  [SIGNAL.SOLAR_RADIATION]: "Solar source",
  [SIGNAL.CORONAL_MASS_EJECTIONS]: "Solar source",
  [SIGNAL.SOLAR_WIND_SPEED]: "Plasma transit",
  [SIGNAL.SOLAR_WIND_DENSITY]: "Plasma transit",
  [SIGNAL.KP_INDEX]: "Geomagnetic impact",
  [SIGNAL.SPACE_WEATHER_ALERTS]: "Geomagnetic impact",
  [SIGNAL.AURORAL_OVAL_PROBABILITY]: "Geomagnetic impact",
  [SIGNAL.ISS_COORDINATES]: "Orbital context",
};

const SIGNAL_ZONE_ORDER = [
  "Solar source",
  "Plasma transit",
  "Geomagnetic impact",
  "Orbital context",
];

const SIGNAL_ZONE_COPY = {
  "Solar source": "Solar output and eruption context.",
  "Plasma transit": "Near-Earth solar wind conditions.",
  "Geomagnetic impact": "Earth response and operational alerts.",
  "Orbital context": "ISS position as a separate telemetry layer.",
};

const SIGNAL_MEANING = {
  [SIGNAL.SOLAR_RADIO_FLUX]:
    "Tracks broad solar activity, giving context for flare and radiation behavior.",
  [SIGNAL.SOLAR_FLARE_EVENTS]:
    "Solar eruptions can coincide with radiation changes and CME activity that later affects near-Earth space.",
  [SIGNAL.SOLAR_RADIATION]:
    "Shows energetic solar output that helps explain the current space-weather backdrop.",
  [SIGNAL.CORONAL_MASS_EJECTIONS]:
    "CME events are large solar releases that can drive plasma disturbances toward Earth.",
  [SIGNAL.SOLAR_WIND_SPEED]:
    "Solar wind speed carries upstream solar conditions into the geomagnetic system.",
  [SIGNAL.SOLAR_WIND_DENSITY]:
    "Density adds pressure context to the solar wind stream that reaches Earth.",
  [SIGNAL.KP_INDEX]:
    "Kp compresses global geomagnetic response into the dashboard's main storm indicator.",
  [SIGNAL.SPACE_WEATHER_ALERTS]:
    "Operational NOAA messages turn changing space-weather signals into watches, alerts, and warnings.",
  [SIGNAL.AURORAL_OVAL_PROBABILITY]:
    "Aurora probability is the visible impact layer of geomagnetic activity.",
  [SIGNAL.ISS_COORDINATES]:
    "ISS position is orbital telemetry, shown as context beside the heliophysical signal chain.",
};

const STAR_POINTS = [
  { x: 50, y: 64, r: 0.9, o: 0.42 },
  { x: 102, y: 242, r: 0.7, o: 0.32 },
  { x: 158, y: 520, r: 1.1, o: 0.38 },
  { x: 238, y: 72, r: 0.8, o: 0.34 },
  { x: 312, y: 392, r: 0.7, o: 0.3 },
  { x: 416, y: 76, r: 1.2, o: 0.48 },
  { x: 496, y: 246, r: 0.7, o: 0.3 },
  { x: 574, y: 540, r: 0.8, o: 0.36 },
  { x: 660, y: 126, r: 0.9, o: 0.4 },
  { x: 746, y: 510, r: 1.1, o: 0.36 },
  { x: 824, y: 94, r: 0.7, o: 0.3 },
  { x: 962, y: 306, r: 1.2, o: 0.42 },
  { x: 1034, y: 168, r: 0.8, o: 0.36 },
  { x: 1068, y: 546, r: 0.9, o: 0.34 },
  { x: 216, y: 274, r: 0.6, o: 0.25 },
  { x: 622, y: 414, r: 0.6, o: 0.28 },
  { x: 884, y: 560, r: 0.6, o: 0.24 },
];

const ZONE_LABELS = [
  { label: "Solar source", x: 96, y: 54 },
  { label: "Plasma transit", x: 412, y: 542 },
  { label: "Geomagnetic impact", x: 700, y: 542 },
  { label: "Orbital context", x: 912, y: 54 },
];

function formatCadence(seconds) {
  if (!seconds) return "Unscheduled";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

function getEdgeKey(source, target) {
  return [source, target].sort().join("__");
}

function buildEdges(registryById) {
  const seen = new Set();
  const edges = [];

  SIGNAL_REGISTRY.forEach((signal) => {
    signal.relatedSignals?.forEach((relatedId) => {
      if (!registryById.has(relatedId)) return;
      if (!NODE_POSITIONS[signal.id] || !NODE_POSITIONS[relatedId]) return;

      const key = getEdgeKey(signal.id, relatedId);
      if (seen.has(key)) return;

      seen.add(key);
      edges.push({ key, source: signal.id, target: relatedId });
    });
  });

  return edges;
}

function getRelatedSignals(activeId, registryById) {
  if (!activeId) return new Set();

  const related = new Set(registryById.get(activeId)?.relatedSignals ?? []);

  SIGNAL_REGISTRY.forEach((signal) => {
    if (signal.relatedSignals?.includes(activeId)) {
      related.add(signal.id);
    }
  });

  return related;
}

function getNodeTone(signal) {
  if (signal.status === SIGNAL_STATUS.PENDING) {
    return {
      dot: "bg-amber-400",
      halo: "shadow-[0_0_26px_rgba(245,158,11,0.58)]",
      label: "text-amber-100",
      accent: "border-amber-300/50 bg-amber-300/10 text-amber-100",
      edge: "#f59e0b",
    };
  }

  if (signal.source === SOURCE.NASA_DONKI || signal.topic === "SOLAR") {
    return {
      dot: "bg-amber-300",
      halo: "shadow-[0_0_24px_rgba(251,191,36,0.52)]",
      label: "text-amber-100",
      accent: "border-amber-300/45 bg-amber-300/10 text-amber-100",
      edge: "#fbbf24",
    };
  }

  return {
    dot: "bg-cyan-300",
    halo: "shadow-[0_0_24px_rgba(34,211,238,0.5)]",
    label: "text-cyan-50",
    accent: "border-cyan-300/45 bg-cyan-300/10 text-cyan-50",
    edge: "#22d3ee",
  };
}

function getDefaultSignal(registryById) {
  return (
    registryById.get(SIGNAL.SPACE_WEATHER_ALERTS) ??
    registryById.get(SIGNAL.KP_INDEX) ??
    SIGNAL_REGISTRY[0]
  );
}

function isEdgeActive(edge, activeId, relatedSignals) {
  if (!activeId) return false;
  return (
    (edge.source === activeId && relatedSignals.has(edge.target)) ||
    (edge.target === activeId && relatedSignals.has(edge.source))
  );
}

function useWideConstellationMap() {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsWide(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isWide;
}

export function SignalConstellationMap() {
  const [activeId, setActiveId] = useState(SIGNAL.SPACE_WEATHER_ALERTS);
  const showFullMap = useWideConstellationMap();

  const registryById = useMemo(
    () => new Map(SIGNAL_REGISTRY.map((signal) => [signal.id, signal])),
    [],
  );
  const edges = useMemo(() => buildEdges(registryById), [registryById]);
  const activeRelatedSignals = useMemo(
    () => getRelatedSignals(activeId, registryById),
    [activeId, registryById],
  );
  const activeEdges = useMemo(
    () =>
      edges.filter((edge) =>
        isEdgeActive(edge, activeId, activeRelatedSignals),
      ),
    [activeId, activeRelatedSignals, edges],
  );

  const activeSignal = activeId ? registryById.get(activeId) : null;
  const displayedSignal = activeSignal ?? getDefaultSignal(registryById);
  const displayedRelatedSignals = [...getRelatedSignals(displayedSignal.id, registryById)]
    .map((signalId) => registryById.get(signalId))
    .filter(Boolean);
  const signalsByZone = useMemo(
    () =>
      SIGNAL_ZONE_ORDER.map((zone) => ({
        zone,
        signals: SIGNAL_REGISTRY.filter((signal) => SIGNAL_ZONE[signal.id] === zone),
      })).filter((group) => group.signals.length),
    [],
  );
  const liveCount = SIGNAL_REGISTRY.filter(
    (signal) => signal.status === SIGNAL_STATUS.LIVE,
  ).length;
  const selectSignal = (signalId) => {
    setActiveId((currentId) => (currentId === signalId ? currentId : signalId));
  };

  return (
    <section
      className="overflow-hidden rounded-[1.5rem] border border-cyan-200/10 bg-[#07111f] text-slate-100 shadow-[0_28px_120px_rgba(0,0,0,0.4)]"
      aria-label="Signal Constellation"
    >
      {!showFullMap && (
        <MobileSignalFlow
          displayedSignal={displayedSignal}
          displayedRelatedSignals={displayedRelatedSignals}
          edges={edges}
          liveCount={liveCount}
          selectSignal={selectSignal}
          signalsByZone={signalsByZone}
        />
      )}

      {showFullMap && (
      <div className="grid gap-0 xl:h-[36rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="relative h-[36rem] overflow-hidden border-b border-cyan-100/10 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.15),transparent_32%),radial-gradient(circle_at_74%_18%,rgba(245,158,11,0.12),transparent_30%),linear-gradient(135deg,rgba(7,17,31,0.96)_0%,rgba(10,21,38,0.92)_44%,rgba(4,10,20,0.98)_100%)] xl:border-b-0 xl:border-r">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.18)_62%,rgba(2,6,23,0.6)_100%)]" />

          <div className="absolute left-6 top-6 z-20 max-w-lg">
            <p className="font-[var(--font-mono)] text-[0.62rem] font-bold uppercase tracking-[0.3em] text-cyan-300">
              Signal flow map
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              Signal Constellation
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
              Solar activity feeds plasma conditions, plasma affects geomagnetic
              state, and the impact layer drives aurora and operational alerts.
            </p>
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label="Signal flow map connecting related HELIOS DECK feeds"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="signal-edge-idle" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.16" />
              </linearGradient>
              <linearGradient id="signal-edge-active" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.86" />
              </linearGradient>
            </defs>

            {STAR_POINTS.map((star) => (
              <circle
                key={`${star.x}-${star.y}`}
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#e0f2fe"
                opacity={star.o}
              />
            ))}

            {ZONE_LABELS.map((zone) => (
              <text
                key={zone.label}
                x={zone.x}
                y={zone.y}
                fill="#94a3b8"
                opacity="0.68"
                fontSize="10"
                fontFamily="monospace"
                letterSpacing="3"
              >
                {zone.label.toUpperCase()}
              </text>
            ))}

            <path
              d="M160 300 C330 265 455 282 565 340 S760 422 910 352"
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="2 18"
              strokeLinecap="round"
              opacity="0.2"
            />

            {edges.map((edge) => {
              const source = NODE_POSITIONS[edge.source];
              const target = NODE_POSITIONS[edge.target];

              return (
                <line
                  key={edge.key}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="url(#signal-edge-idle)"
                  strokeWidth="0.9"
                  strokeDasharray="3 9"
                  strokeLinecap="round"
                  opacity="0.48"
                />
              );
            })}

            {activeEdges.map((edge) => {
              const source = NODE_POSITIONS[edge.source];
              const target = NODE_POSITIONS[edge.target];

              return (
                <line
                  key={`active-${edge.key}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="url(#signal-edge-active)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0">
            {SIGNAL_REGISTRY.map((signal) => {
              const position = NODE_POSITIONS[signal.id];
              if (!position) return null;

              const tone = getNodeTone(signal);
              const labelSide = NODE_LABEL_SIDE[signal.id] ?? "right";

              return (
                <div
                  key={signal.id}
                  className="absolute z-10"
                  style={{
                    left: `${(position.x / MAP_WIDTH) * 100}%`,
                    top: `${(position.y / MAP_HEIGHT) * 100}%`,
                  }}
                >
                  <Link
                    to={signal.route}
                    className={[
                      "group absolute top-[-1.1rem] h-9 w-48 rounded-lg outline-none",
                      "focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                      labelSide === "left" ? "right-[-0.65rem]" : "left-[-0.65rem]",
                    ].join(" ")}
                    aria-label={`${signal.label}. ${signal.status} signal from ${signal.sourceLabel}. ${SIGNAL_MEANING[signal.id] ?? "Related HELIOS DECK signal."}`}
                    onFocus={() => selectSignal(signal.id)}
                    onMouseEnter={() => selectSignal(signal.id)}
                  >
                    <span
                      className={[
                        "absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center",
                        labelSide === "left" ? "right-0" : "left-0",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute h-5 w-5 rounded-full opacity-30 blur-[1px]",
                          tone.dot,
                        ].join(" ")}
                        aria-hidden="true"
                      />
                      <span
                        className={[
                          "relative h-2.5 w-2.5 rounded-full ring-2 ring-white/30",
                          tone.dot,
                          tone.halo,
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={[
                        "absolute top-1/2 w-40 -translate-y-1/2",
                        labelSide === "left" ? "right-7 text-right" : "left-7 text-left",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "block overflow-hidden text-ellipsis whitespace-nowrap font-[var(--font-mono)] text-[0.56rem] font-black uppercase tracking-[0.1em]",
                          tone.label,
                        ].join(" ")}
                      >
                        {signal.label}
                      </span>
                      <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-[var(--font-mono)] text-[0.45rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {signal.status}
                      </span>
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-5 left-6 right-6 z-20 flex flex-wrap items-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.18em]">
            <span className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-cyan-100">
              Cyan live feeds
            </span>
            <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-amber-100">
              Amber solar source
            </span>
            <span className="rounded-full border border-slate-500/35 bg-slate-900/60 px-3 py-1 text-slate-300">
              Lines are registry relations
            </span>
          </div>
        </div>

        <aside className="flex h-[36rem] min-h-0 flex-col justify-between overflow-y-auto bg-slate-950 p-6">
          <div>
            <p className="font-[var(--font-mono)] text-[0.62rem] font-bold uppercase tracking-[0.3em] text-cyan-300">
              Interpretation
            </p>
            <div className="mt-5 min-h-[28rem]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {SIGNAL_ZONE[displayedSignal.id]}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                    {displayedSignal.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {displayedSignal.provider}
                  </p>
                </div>
                <span
                  className={[
                    "rounded-full border px-2.5 py-1 font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.18em]",
                    displayedSignal.status === SIGNAL_STATUS.LIVE
                      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
                      : "border-amber-300/40 bg-amber-300/10 text-amber-100",
                  ].join(" ")}
                >
                  {displayedSignal.status}
                </span>
              </div>

              <p className="mt-5 min-h-[7.5rem] rounded-2xl border border-cyan-100/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
                {SIGNAL_MEANING[displayedSignal.id] ??
                  "This signal contributes context to the HELIOS DECK signal map."}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Source
                  </dt>
                  <dd className="mt-1 font-bold text-slate-100">
                    {displayedSignal.sourceLabel}
                  </dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Unit
                  </dt>
                  <dd className="mt-1 font-bold text-slate-100">
                    {displayedSignal.unit}
                  </dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Cadence
                  </dt>
                  <dd className="mt-1 font-bold text-slate-100">
                    {formatCadence(displayedSignal.cadenceSeconds)}
                  </dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Relations
                  </dt>
                  <dd className="mt-1 font-bold text-slate-100">
                    {displayedRelatedSignals.length}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <p className="font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Connected signals
                </p>
                <div className="mt-2 flex min-h-[5.5rem] flex-wrap content-start gap-2">
                  {displayedRelatedSignals.length ? (
                    displayedRelatedSignals.map((signal) => {
                      const tone = getNodeTone(signal);
                      return (
                        <Link
                          key={signal.id}
                          to={signal.route}
                          className={[
                            "rounded-full border px-2.5 py-1 font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.16em] transition hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
                            tone.accent,
                          ].join(" ")}
                        >
                          {signal.label}
                        </Link>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-500">
                      No direct registry relations yet.
                    </span>
                  )}
                </div>
              </div>

              <Link
                to={displayedSignal.route}
                className="mt-6 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 font-[var(--font-mono)] text-[0.65rem] font-black uppercase tracking-[0.18em] text-cyan-100 transition-colors hover:border-amber-300/55 hover:bg-amber-300/10 hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                Open signal
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.18em] text-emerald-200">
                {liveCount} live
              </span>
              <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.18em] text-amber-100">
                {SIGNAL_REGISTRY.length - liveCount} pending
              </span>
              <span className="rounded-full border border-slate-500/35 bg-white/[0.04] px-3 py-1 font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.18em] text-slate-300">
                {edges.length} relations
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              This is a HELIOS DECK product relationship map, not an astronomy
              atlas. Hover, focus, or tab through nodes to read each signal's
              role in the flow.
            </p>
          </div>
        </aside>
      </div>
      )}

      <p className="sr-only">
        The Signal Constellation Map lists all registry signals as accessible
        links. The visualization groups signals into solar source, plasma
        transit, geomagnetic impact, and orbital context zones. The detailed
        table below provides the same catalogue information in reading order.
      </p>
    </section>
  );
}

function MobileSignalFlow({
  displayedSignal,
  displayedRelatedSignals,
  edges,
  liveCount,
  selectSignal,
  signalsByZone,
}) {
  const relatedIds = new Set(displayedRelatedSignals.map((signal) => signal.id));

  return (
    <div className="xl:hidden bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.16),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(245,158,11,0.12),transparent_36%),linear-gradient(135deg,rgba(7,17,31,0.98),rgba(5,12,24,0.98))] p-3 sm:p-4">
      <div>
        <p className="font-[var(--font-mono)] text-[0.58rem] font-bold uppercase tracking-[0.28em] text-cyan-300">
          Signal flow map
        </p>
        <h2 className="mt-2 text-xl font-black tracking-tight text-white">
          Signal Constellation
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          A phone-friendly view of how HELIOS DECK signals move from solar
          source to Earth impact.
        </p>
      </div>

      <MobileConstellationPreview
        displayedSignal={displayedSignal}
        displayedRelatedSignals={displayedRelatedSignals}
        edges={edges}
        selectSignal={selectSignal}
      />

      <div className="mt-4 space-y-4" aria-label="Signal flow zones">
        {signalsByZone.map((group, groupIndex) => (
          <section
            key={group.zone}
            className="relative rounded-2xl border border-white/10 bg-slate-950/35 p-3"
          >
            {groupIndex < signalsByZone.length - 1 && (
              <span
                className="absolute bottom-[-1rem] left-6 h-4 border-l border-dashed border-cyan-200/25"
                aria-hidden="true"
              />
            )}
            <div className="mb-3">
              <h3 className="font-[var(--font-mono)] text-[0.62rem] font-black uppercase tracking-[0.2em] text-cyan-200">
                {group.zone}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {SIGNAL_ZONE_COPY[group.zone]}
              </p>
            </div>

            <ul className="space-y-2" role="list">
              {group.signals.map((signal) => {
                const tone = getNodeTone(signal);
                const isSelected = signal.id === displayedSignal.id;
                const isRelated = relatedIds.has(signal.id);

                return (
                  <li key={signal.id}>
                    <button
                      type="button"
                      className={[
                        "flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        isSelected
                          ? "border-cyan-200/45 bg-cyan-200/12"
                          : isRelated
                            ? "border-amber-200/35 bg-amber-200/8"
                            : "border-white/10 bg-white/[0.035]",
                      ].join(" ")}
                      onClick={() => selectSignal(signal.id)}
                      aria-pressed={isSelected}
                      aria-expanded={isSelected}
                      aria-label={`${signal.label}. ${signal.status}. ${SIGNAL_MEANING[signal.id] ?? "HELIOS DECK signal."}`}
                    >
                      <span
                        className={[
                          "h-3 w-3 shrink-0 rounded-full ring-2 ring-white/25",
                          tone.dot,
                          tone.halo,
                        ].join(" ")}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-[var(--font-mono)] text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-100">
                          {signal.label}
                        </span>
                        <span className="mt-1 block truncate font-[var(--font-mono)] text-[0.52rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                          {signal.sourceLabel} / {signal.status}
                        </span>
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-1 font-[var(--font-mono)] text-[0.52rem] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {isRelated ? "Linked" : SIGNAL_ZONE[signal.id]?.split(" ")[0]}
                      </span>
                    </button>
                    {isSelected && (
                      <MobileSignalDetails
                        displayedRelatedSignals={displayedRelatedSignals}
                        signal={signal}
                        selectSignal={selectSignal}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.16em] text-emerald-200">
          {liveCount} live
        </span>
        <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.16em] text-amber-100">
          {SIGNAL_REGISTRY.length - liveCount} pending
        </span>
        <span className="rounded-full border border-slate-500/35 bg-white/[0.04] px-3 py-1 font-[var(--font-mono)] text-[0.56rem] font-bold uppercase tracking-[0.16em] text-slate-300">
          {edges.length} relations
        </span>
      </div>
    </div>
  );
}

function MobileConstellationPreview({
  displayedSignal,
  displayedRelatedSignals,
  edges,
  selectSignal,
}) {
  const relatedIds = new Set(displayedRelatedSignals.map((signal) => signal.id));

  return (
    <section
      className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/[0.05] p-3"
      aria-label="Mobile signal constellation map"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-[var(--font-mono)] text-[0.54rem] font-bold uppercase tracking-[0.18em] text-cyan-300">
            Tap nodes to draw lines
          </p>
          <h3 className="mt-1 truncate text-base font-black text-white">
            {displayedSignal.label}
          </h3>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 font-[var(--font-mono)] text-[0.52rem] font-bold uppercase tracking-[0.12em] text-slate-400">
          {displayedRelatedSignals.length} links
        </span>
      </div>

      <div className="relative mt-3 h-56 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_28%_18%,rgba(34,211,238,0.12),transparent_34%),linear-gradient(135deg,rgba(2,8,23,0.92),rgba(7,16,31,0.96))]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:54px_54px]" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mobile-relation-line" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.72" />
            </linearGradient>
          </defs>

          {edges.map((edge) => {
            const source = NODE_POSITIONS[edge.source];
            const target = NODE_POSITIONS[edge.target];
            if (!source || !target) return null;

            return (
              <line
                key={edge.key}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#67e8f9"
                strokeDasharray="3 12"
                strokeLinecap="round"
                strokeWidth="1"
                opacity="0.16"
              />
            );
          })}

          {edges.map((edge) => {
            const isActive =
              (edge.source === displayedSignal.id && relatedIds.has(edge.target)) ||
              (edge.target === displayedSignal.id && relatedIds.has(edge.source));
            if (!isActive) return null;

            const source = NODE_POSITIONS[edge.source];
            const target = NODE_POSITIONS[edge.target];
            if (!source || !target) return null;

            return (
              <line
                key={`mobile-active-${edge.key}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="url(#mobile-relation-line)"
                strokeLinecap="round"
                strokeWidth="3"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0">
          {SIGNAL_REGISTRY.map((signal) => {
            const position = NODE_POSITIONS[signal.id];
            if (!position) return null;

            const tone = getNodeTone(signal);
            const isSelected = signal.id === displayedSignal.id;
            const isRelated = relatedIds.has(signal.id);

            return (
              <button
                key={signal.id}
                type="button"
                className={[
                  "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[opacity,transform] active:scale-95",
                  isSelected ? "z-20 h-11 w-11" : "z-10 h-9 w-9",
                  !isSelected && !isRelated ? "opacity-45" : "opacity-100",
                ].join(" ")}
                style={{
                  left: `${(position.x / MAP_WIDTH) * 100}%`,
                  top: `${(position.y / MAP_HEIGHT) * 100}%`,
                }}
                onClick={() => selectSignal(signal.id)}
                aria-label={`Show relation lines for ${signal.label}`}
                aria-pressed={isSelected}
              >
                <span
                  className={[
                    "absolute rounded-full blur-sm",
                    isSelected ? "h-8 w-8 opacity-45" : "h-6 w-6 opacity-25",
                    tone.dot,
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "relative rounded-full ring-2 ring-white/25",
                    isSelected ? "h-4 w-4" : "h-3 w-3",
                    tone.dot,
                    tone.halo,
                  ].join(" ")}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {displayedRelatedSignals.map((signal) => {
          const tone = getNodeTone(signal);
          return (
            <button
              key={signal.id}
              type="button"
              className={[
                "rounded-full border px-2.5 py-1 font-[var(--font-mono)] text-[0.55rem] font-bold uppercase tracking-[0.12em] transition-colors",
                tone.accent,
              ].join(" ")}
              onClick={() => selectSignal(signal.id)}
            >
              {signal.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MobileSignalDetails({
  displayedRelatedSignals,
  signal,
  selectSignal,
}) {
  return (
    <div className="mt-2 rounded-xl border border-cyan-100/10 bg-slate-950/50 p-3">
      <p className="text-sm leading-6 text-slate-300">
        {SIGNAL_MEANING[signal.id] ??
          "This signal contributes context to the HELIOS DECK signal map."}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {[
          ["Status", signal.status],
          ["Source", signal.sourceLabel],
          ["Unit", signal.unit],
          ["Cadence", formatCadence(signal.cadenceSeconds)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-2"
          >
            <dt className="font-[var(--font-mono)] text-[0.5rem] font-bold uppercase tracking-[0.14em] text-slate-500">
              {label}
            </dt>
            <dd className="mt-1 truncate font-bold text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        {displayedRelatedSignals.length ? (
          displayedRelatedSignals.map((relatedSignal) => {
            const tone = getNodeTone(relatedSignal);
            return (
              <button
                key={relatedSignal.id}
                type="button"
                className={[
                  "rounded-full border px-2.5 py-1 font-[var(--font-mono)] text-[0.52rem] font-bold uppercase tracking-[0.12em]",
                  tone.accent,
                ].join(" ")}
                onClick={() => selectSignal(relatedSignal.id)}
              >
                {relatedSignal.label}
              </button>
            );
          })
        ) : (
          <span className="text-xs text-slate-500">
            No direct registry relations yet.
          </span>
        )}
      </div>

      <Link
        to={signal.route}
        className="mt-3 inline-flex min-h-10 items-center rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 font-[var(--font-mono)] text-[0.58rem] font-black uppercase tracking-[0.14em] text-cyan-100"
      >
        Open signal
      </Link>
    </div>
  );
}
