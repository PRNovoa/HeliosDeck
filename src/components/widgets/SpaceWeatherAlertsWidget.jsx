import { useSpaceWeatherAlerts } from "@/hooks/useSpaceWeatherAlerts.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { formatTimestamp } from "@/lib/formatters.js";
import { SOURCE } from "@/lib/constants.js";

const SEVERITY_CLASS = {
  high: "border-[rgba(248,113,113,0.42)] bg-[rgba(248,113,113,0.12)] text-[var(--color-accent-red)]",
  medium: "border-[rgba(245,158,11,0.44)] bg-[rgba(245,158,11,0.12)] text-[var(--color-accent-amber)]",
  low: "border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.1)] text-[var(--color-accent-cyan)]",
  unknown: "border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-muted)]",
};

export function SpaceWeatherAlertsWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSpaceWeatherAlerts();

  if (isLoading) {
    return (
      <DashboardCard title="SPACE WEATHER ALERTS" accent="var(--color-accent-amber)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="SPACE WEATHER ALERTS" accent="var(--color-accent-amber)">
        <ErrorFallback error={error} signal="NOAA Alerts" onRetry={refetch} />
      </DashboardCard>
    );
  }

  const alerts = data ?? [];
  const latest = alerts[0] ?? null;

  return (
    <DashboardCard
      title="SPACE WEATHER ALERTS"
      accent="var(--color-accent-amber)"
      headerRight={
        <span className="rounded-full border border-[rgba(20,184,166,0.34)] bg-[rgba(20,184,166,0.1)] px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[var(--color-geo-teal)]">
          NOAA SWPC
        </span>
      }
    >
      {alerts.length === 0 ? (
        <EmptyState message="No active alerts" icon="*" />
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Latest NOAA space weather alerts">
          {alerts.slice(0, 3).map((alert) => (
            <li
              key={`${alert.value.productId}-${alert.timestamp}-${alert.value.serialNumber}`}
              className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
                  {alert.value.messageType}
                </span>
                <span
                  className={[
                    "rounded-full border px-2 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.12em]",
                    SEVERITY_CLASS[alert.value.severity] ?? SEVERITY_CLASS.unknown,
                  ].join(" ")}
                >
                  {alert.value.severity}
                </span>
              </div>
              <p className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--color-text-primary)]">
                {alert.value.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)]">
                {alert.value.summary}
              </p>
              <time className="mt-2 block font-mono text-[0.58rem] uppercase tracking-wider text-[var(--color-text-muted)]">
                {formatTimestamp(alert.timestamp)}
              </time>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={latest?.source ?? SOURCE.NOAA_SWPC} />
        <LastUpdatedIndicator timestamp={latest?.timestamp ?? null} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
