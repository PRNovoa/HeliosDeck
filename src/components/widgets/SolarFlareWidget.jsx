import { useSolarFlares } from "@/hooks/useSolarFlares.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes.js";

const CLASS_COLOURS = {
  X: "var(--color-accent-red)",
  M: "var(--color-accent-amber)",
  C: "#eab308",
  B: "var(--color-accent-cyan)",
  A: "var(--color-text-secondary)",
};

/** Derive a rough X-ray flux proxy percentage from class type. */
function fluxPercent(classType) {
  const letter = classType?.charAt(0).toUpperCase();
  return { X: 100, M: 72, C: 40, B: 20, A: 8 }[letter] ?? 0;
}

/**
 * SolarFlareWidget
 * -------------------------------------------------------
 * Hero card showing the most recent / most severe solar flare.
 * Fetches from NASA DONKI via useSolarFlares hook.
 */
export function SolarFlareWidget({ days = 7 }) {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSolarFlares(days);

  if (isLoading) {
    return (
      <DashboardCard
        title="SOLAR FLARE SUMMARY"
        accent="var(--color-accent-red)"
      >
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard
        title="SOLAR FLARE SUMMARY"
        accent="var(--color-accent-red)"
      >
        <ErrorFallback error={error} signal="Solar Flares" onRetry={refetch} />
      </DashboardCard>
    );
  }

  const flares = data ?? [];
  const top = flares[0] ?? null;
  const latestTimestamp = top?.timestamp ?? null;
  const latestSource = top?.source ?? "NASA_DONKI";

  if (!top) {
    return (
      <DashboardCard
        title="SOLAR FLARE SUMMARY"
        accent="var(--color-accent-red)"
      >
        <EmptyState message={`No flares in last ${days} days`} icon="*" />
        <footer className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
          <SourceBadge source={latestSource} />
          <LastUpdatedIndicator
            timestamp={latestTimestamp}
            isFetching={isFetching}
          />
        </footer>
      </DashboardCard>
    );
  }

  const { value } = top;
  const letter = value.classType?.charAt(0).toUpperCase() ?? "?";
  const colour = CLASS_COLOURS[letter] ?? "var(--color-text-secondary)";
  const pct = fluxPercent(value.classType);
  const isActive = !value.endTime;

  const peakTime = value.peakTime
    ? new Date(value.peakTime).toISOString().substring(11, 16) + " UTC"
    : "-";

  const duration =
    value.beginTime && value.endTime
      ? `${Math.round((new Date(value.endTime) - new Date(value.beginTime)) / 60000)} min`
      : value.beginTime && !value.endTime
        ? "Ongoing"
        : "-";

  return (
    <DashboardCard
      title="SOLAR FLARE SUMMARY"
      accent={colour}
      headerRight={
        isActive ? (
          <span className="rounded-full border border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.08)] px-1.5 py-px text-[0.5rem] font-bold tracking-[0.12em] text-[var(--color-accent-green)]">
            ACTIVE
          </span>
        ) : null
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-0.5">
          <span
            className="font-mono text-[2.75rem] font-bold leading-none"
            style={{ color: colour }}
          >
            {value.classType ?? "-"}
          </span>
          <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            CLASS {letter}-FLARE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              PEAK
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
              {peakTime}
            </span>
          </div>
          <div className="h-7 w-px shrink-0 bg-[var(--color-border)]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              DURATION
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
              {duration}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              X-RAY FLUX
            </span>
            <span className="font-mono text-[0.625rem] text-[var(--color-text-secondary)]">
              {pct}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.07)]">
            <div
              className="h-full rounded-full shadow-[0_0_8px_currentColor] transition-[width] duration-[400ms] ease-out"
              style={{ width: `${pct}%`, background: colour }}
            />
          </div>
        </div>
      </div>

      <footer className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <Link
          to={ROUTES.SOLAR_FLARES}
          className="text-[0.5625rem] font-bold tracking-[0.1em] text-[var(--color-text-muted)] no-underline transition-colors duration-150 hover:text-[var(--color-accent-amber)]"
        >
          VIEW EVENTS -&gt;
        </Link>
        <div className="flex items-center gap-2">
          <SourceBadge source={latestSource} />
          <LastUpdatedIndicator
            timestamp={latestTimestamp}
            isFetching={isFetching}
          />
        </div>
      </footer>
    </DashboardCard>
  );
}
