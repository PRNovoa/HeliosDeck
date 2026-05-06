import { Link } from "react-router-dom";
import { SIGNAL_REGISTRY } from "@/lib/signalRegistry.js";

const STATUS_COLOUR = {
  LIVE: "var(--color-geo-green)",
  PENDING: "var(--color-solar-amber)",
  MOCK: "var(--color-text-muted)",
};

function formatCadence(seconds) {
  if (!seconds) return null;
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

/**
 * SignalPageLayout — Shared layout for all signal detail pages.
 *
 * Props:
 *   title          {string}   — page heading
 *   description    {string}   — one-paragraph description
 *   sourceLabel    {string}   — display name of the data source
 *   sourceUrl      {string}   — link to the source API docs
 *   status         {string}   — "LIVE" | "PENDING" | "MOCK"
 *   cadenceSeconds {number}   — data refresh cadence in seconds
 *   relatedSignals {string[]} — array of SIGNAL id strings
 *   children       {ReactNode}
 */
export function SignalPageLayout({
  title,
  description,
  sourceLabel,
  sourceUrl,
  status = "LIVE",
  cadenceSeconds,
  relatedSignals = [],
  children,
}) {
  const relatedMeta = relatedSignals
    .map((id) => SIGNAL_REGISTRY.find((s) => s.id === id))
    .filter(Boolean);

  const cadenceLabel = formatCadence(cadenceSeconds);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5">
        <h1 className="text-xl font-bold tracking-widest uppercase text-[var(--color-text-primary)]">
          {title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          {sourceLabel && sourceUrl && (
            <span className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-border)] rounded font-[var(--font-mono)] text-[var(--color-text-muted)]">
              SOURCE:{" "}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-orange)] transition-colors"
              >
                {sourceLabel}
              </a>
            </span>
          )}

          <span
            className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border rounded font-[var(--font-mono)]"
            style={{
              color: STATUS_COLOUR[status],
              borderColor: STATUS_COLOUR[status],
            }}
            aria-label={`Status: ${status}`}
          >
            ● {status}
          </span>

          {cadenceLabel && (
            <span className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-border)] rounded font-[var(--font-mono)] text-[var(--color-text-muted)]">
              CADENCE: {cadenceLabel}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {description}
          </p>
        )}

        {relatedMeta.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]">
              RELATED:
            </span>
            {relatedMeta.map((s) => (
              <Link
                key={s.id}
                to={s.route}
                className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] rounded hover:bg-[var(--color-accent-blue-dim)] transition-colors font-[var(--font-mono)]"
              >
                {s.icon} {s.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="flex flex-col gap-6">{children}</div>
    </article>
  );
}
