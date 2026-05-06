import { SOURCE } from "@/lib/constants.js";

const SOURCE_LABELS = {
  [SOURCE.ISS_API]: "ISS API",
  [SOURCE.NASA_DONKI]: "NASA DONKI",
  [SOURCE.NASA_POWER]: "NASA POWER",
  [SOURCE.NOAA_SWPC]: "NOAA SWPC",
  [SOURCE.GFZ]: "GFZ",
  [SOURCE.MOCK]: "MOCK DATA",
  [SOURCE.UNKNOWN]: "UNKNOWN",
};

const SOURCE_COLOURS = {
  [SOURCE.ISS_API]: "var(--color-geo-cyan)",
  [SOURCE.NASA_DONKI]: "var(--color-solar-amber)",
  [SOURCE.NASA_POWER]: "var(--color-solar-gold)",
  [SOURCE.NOAA_SWPC]: "var(--color-geo-teal)",
  [SOURCE.GFZ]: "var(--color-geo-blue)",
  [SOURCE.MOCK]: "var(--color-text-muted)",
  [SOURCE.UNKNOWN]: "var(--color-text-muted)",
};

/**
 * SourceBadge — Displays the data source of a NormalizedSignal.
 * Props:
 *   source {string} — SOURCE constant
 */
export function SourceBadge({ source }) {
  const label = SOURCE_LABELS[source] ?? source;
  const colour = SOURCE_COLOURS[source] ?? "var(--color-text-muted)";

  return (
    <span
      className="inline-flex items-center font-[var(--font-mono)] text-[0.6rem] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded-sm border"
      style={{
        color: colour,
        borderColor: colour,
        background: `color-mix(in srgb, ${colour} 10%, transparent)`,
      }}
      aria-label={`Data source: ${label}`}
    >
      {label}
    </span>
  );
}
