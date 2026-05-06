import { useCME } from "@/hooks/useCME.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { SOURCE } from "@/lib/constants.js";
import { formatNumber, formatTimestamp } from "@/lib/formatters.js";

export function CMEWidget({ days = 7 }) {
  const { data, isLoading, isError, error, isFetching, refetch } = useCME(days);

  if (isLoading) {
    return (
      <DashboardCard title="CME EVENTS" accent="var(--color-accent-red)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : String(error);
    const isRateLimited = message.includes("OVER_RATE_LIMIT") || message.includes("429");
    return (
      <DashboardCard title="CME EVENTS" accent="var(--color-accent-red)">
        {isRateLimited ? (
          <div role="status" className="flex flex-col gap-3">
            <EmptyState message="NASA DEMO_KEY rate limit reached" icon="*" />
            <p className="text-center text-xs leading-5 text-[var(--color-text-muted)]">
              Add `VITE_NASA_API_KEY` in `.env.local` for higher DONKI quota.
            </p>
          </div>
        ) : (
          <ErrorFallback error={error} signal="CME" onRetry={refetch} />
        )}
      </DashboardCard>
    );
  }

  const events = data ?? [];
  const top = events[0] ?? null;

  return (
    <DashboardCard title="CME EVENTS" accent="var(--color-accent-red)">
      {!top ? (
        <EmptyState message={`No CME events in last ${days} days`} icon="*" />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[2.25rem] font-bold leading-none text-[var(--color-accent-red)]">
                {formatNumber(top.value.speed_km_s, 0)}
              </p>
              <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                km/s estimated speed
              </p>
            </div>
            <span className="rounded-full border border-[rgba(248,113,113,0.38)] bg-[rgba(248,113,113,0.12)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-red)]">
              {top.value.activityLevel}
            </span>
          </div>
          <p className="line-clamp-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            {top.value.note || top.value.id || "NASA DONKI CME analysis event"}
          </p>
          <time className="font-mono text-[0.62rem] uppercase tracking-wider text-[var(--color-text-muted)]">
            {formatTimestamp(top.timestamp)}
          </time>
        </div>
      )}

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={top?.source ?? SOURCE.NASA_DONKI} />
        <LastUpdatedIndicator timestamp={top?.timestamp ?? null} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
