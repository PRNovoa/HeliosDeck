import { useState } from "react";
import { Link } from "react-router-dom";
import { SignalConstellationMap } from "@/components/visualizations/SignalConstellationMap.jsx";
import { SIGNAL_REGISTRY, SIGNAL_STATUS } from "@/lib/signalRegistry.js";
import { SOURCE } from "@/lib/constants.js";

const STATUS_COLOURS = {
  [SIGNAL_STATUS.LIVE]: "var(--color-geo-green)",
  [SIGNAL_STATUS.PENDING]: "var(--color-solar-amber)",
  [SIGNAL_STATUS.MOCK]: "var(--color-text-muted)",
};

const FILTERS = [
  "ALL",
  SIGNAL_STATUS.LIVE,
  SIGNAL_STATUS.PENDING,
  SOURCE.NASA_DONKI,
  SOURCE.NOAA_SWPC,
  SOURCE.ISS_API,
];

function formatCadence(seconds) {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

function formatFilterLabel(filter) {
  if (filter === SOURCE.NASA_DONKI) return "NASA";
  if (filter === SOURCE.NOAA_SWPC) return "NOAA";
  if (filter === SOURCE.ISS_API) return "ISS";
  return filter;
}

export function SignalsPage() {
  const [filter, setFilter] = useState("ALL");

  const visible = SIGNAL_REGISTRY.filter((s) => {
    if (filter === "ALL") return true;
    if ([SIGNAL_STATUS.LIVE, SIGNAL_STATUS.PENDING].includes(filter)) {
      return s.status === filter;
    }
    return s.source === filter;
  });

  const liveCount = SIGNAL_REGISTRY.filter(
    (s) => s.status === SIGNAL_STATUS.LIVE,
  ).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8">
      <header className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-4">
        <h1 className="text-lg font-bold uppercase tracking-widest text-[var(--color-text-primary)] sm:text-xl">
          SIGNAL CATALOGUE
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          All geophysical and heliophysical signals tracked by Helios Deck.{" "}
          <strong style={{ color: "var(--color-geo-green)" }}>
            {liveCount} LIVE
          </strong>{" "}
          /{" "}
          <strong style={{ color: "var(--color-solar-amber)" }}>
            {SIGNAL_REGISTRY.length - liveCount} PENDING
          </strong>
        </p>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter signals"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              className={[
                "text-[0.6rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded border transition-colors font-[var(--font-mono)]",
                filter === f
                  ? "text-[var(--color-accent-orange)] border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-dim)]"
                  : "text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {formatFilterLabel(f)}
            </button>
          ))}
        </div>
      </header>

      <SignalConstellationMap />

      <div className="overflow-x-auto" role="region" aria-label="Signal list">
        <table className="min-w-[58rem] w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {[
                "SIGNAL",
                "TOPIC",
                "PROVIDER",
                "UNIT",
                "CADENCE",
                "STATUS",
                "IMPL",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3 text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr
                key={s.id}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <td className="py-2 px-3">
                  <Link
                    to={s.route}
                    className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-orange)] transition-colors"
                  >
                    <span aria-hidden="true">{s.icon}</span> {s.label}
                  </Link>
                </td>
                <td className="py-2 px-3 font-[var(--font-mono)] text-[var(--color-text-secondary)]">
                  {s.topic}
                </td>
                <td className="py-2 px-3">
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-orange)] transition-colors"
                  >
                    {s.sourceLabel}
                  </a>
                </td>
                <td className="py-2 px-3 font-[var(--font-mono)] text-[var(--color-text-secondary)]">
                  {s.unit}
                </td>
                <td className="py-2 px-3 font-[var(--font-mono)] text-[var(--color-text-secondary)]">
                  {formatCadence(s.cadenceSeconds)}
                </td>
                <td className="py-2 px-3">
                  <span
                    className="font-bold font-[var(--font-mono)]"
                    style={{ color: STATUS_COLOURS[s.status] }}
                    aria-label={`Status: ${s.status}`}
                  >
                    ● {s.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={
                      s.implemented
                        ? "text-[var(--color-accent-green)] font-bold"
                        : "text-[var(--color-text-muted)]"
                    }
                    aria-label={
                      s.implemented ? "Implemented" : "Pending implementation"
                    }
                    title={
                      s.implemented
                        ? "Implemented"
                        : s.pendingReason || "Pending implementation"
                    }
                  >
                    {s.implemented ? "✓" : "PENDING"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
