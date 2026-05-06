import { formatRelativeTime, formatTimestamp } from "@/lib/formatters.js";

/**
 * LastUpdatedIndicator — Shows when data was last refreshed.
 *
 * Props:
 *   timestamp?   {string|null}  — ISO 8601 string or null
 *   isFetching?  {boolean}      — true while TanStack Query is refetching
 */
export function LastUpdatedIndicator({ timestamp, isFetching = false }) {
  const relative = formatRelativeTime(timestamp);
  const absolute = formatTimestamp(timestamp);

  return (
    <span
      className="inline-flex items-center gap-1 text-[0.6rem] font-semibold tracking-wider text-[var(--color-text-muted)] font-[var(--font-mono)]"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Last updated: ${absolute}`}
    >
      {isFetching ? (
        <span className="text-[var(--color-accent-green)] animate-blink">
          ● UPDATING…
        </span>
      ) : (
        <>
          <span
            className="text-[var(--color-accent-green)] text-[0.5rem]"
            aria-hidden="true"
          >
            ●
          </span>
          <time dateTime={timestamp ?? undefined} title={absolute}>
            {relative}
          </time>
        </>
      )}
    </span>
  );
}
