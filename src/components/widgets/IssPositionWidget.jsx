import { useISSPosition } from "@/hooks/useISSPosition.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { formatNumber } from "@/lib/formatters.js";

/**
 * IssPositionWidget
 * -------------------------------------------------------
 * Live ISS coordinates with map-style visual and live tracking badge.
 * Refreshes every 5 seconds via useISSPosition hook.
 */
export function IssPositionWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useISSPosition();

  if (isLoading) {
    return (
      <DashboardCard title="ISS POSITION" accent="var(--color-accent-cyan)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError || data?.error) {
    return (
      <DashboardCard title="ISS POSITION" accent="var(--color-accent-cyan)">
        <ErrorFallback
          error={isError ? error : data.error}
          signal="ISS"
          onRetry={refetch}
        />
      </DashboardCard>
    );
  }

  const { value, timestamp, source } = data;
  const lat = value.latitude ?? 0;
  const lon = value.longitude ?? 0;

  return (
    <DashboardCard title="ISS POSITION" accent="var(--color-accent-cyan)">
      <div
        className="flex flex-col gap-3"
        aria-live="polite"
        aria-atomic="true"
        aria-label="ISS live position data"
      >
        <div
          className="relative flex h-[7.5rem] items-center justify-center overflow-hidden rounded-md border border-[rgba(34,211,238,0.14)] bg-[radial-gradient(ellipse_at_center,rgba(7,25,48,0.92)_0%,rgba(2,8,18,0.97)_100%)]"
          aria-hidden="true"
        >
          <div className="absolute -left-[15%] -top-[15%] h-[130%] w-[130%] animate-[orbit-spin_50s_linear_infinite] rounded-full border border-dashed border-[rgba(245,158,11,0.25)]" />
          <div className="absolute -left-[30%] -top-[30%] h-[160%] w-[160%] animate-[orbit-spin_80s_linear_infinite_reverse] rounded-full border border-[rgba(34,211,238,0.06)]" />
          <span className="relative z-[1] text-xl text-[var(--color-accent-cyan)] [text-shadow:0_0_14px_var(--color-accent-cyan)]">
            {"\u25cf"}
          </span>
          <div className="absolute bottom-2 left-3 flex items-center gap-2 text-[0.5rem] font-bold tracking-[0.12em] text-[var(--color-accent-green)]">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-[var(--color-accent-green)] shadow-[0_0_6px_var(--color-accent-green)]" />
            LIVE TRACKING
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              LATITUDE
            </dt>
            <dd className="font-mono text-md font-semibold leading-tight text-[var(--color-text-primary)]">
              {Math.abs(lat).toFixed(2)}
              {"\u00b0"}
              {lat >= 0 ? "N" : "S"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              LONGITUDE
            </dt>
            <dd className="font-mono text-md font-semibold leading-tight text-[var(--color-text-primary)]">
              {Math.abs(lon).toFixed(2)}
              {"\u00b0"}
              {lon >= 0 ? "E" : "W"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              ALTITUDE
            </dt>
            <dd className="font-mono text-md font-semibold leading-tight text-[var(--color-text-primary)]">
              {formatNumber(value.altitude_km, 0)}
              <span className="text-xs font-normal text-[var(--color-text-secondary)]">
                {" "}km
              </span>
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              VELOCITY
            </dt>
            <dd className="font-mono text-md font-semibold leading-tight text-[var(--color-text-primary)]">
              {value.velocity_kmh
                ? (value.velocity_kmh / 3600).toFixed(2)
                : "N/A"}
              <span className="text-xs font-normal text-[var(--color-text-secondary)]">
                {" "}km/s
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <footer className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={source} />
        <LastUpdatedIndicator timestamp={timestamp} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
