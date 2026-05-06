import { useSolarWind } from "@/hooks/useSolarWind.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { formatNumber } from "@/lib/formatters.js";
import { SOURCE } from "@/lib/constants.js";

function classifyDensity(value) {
  if (value == null) return "unknown";
  if (value < 2) return "thin";
  if (value <= 8) return "nominal";
  if (value <= 20) return "dense";
  return "compressed";
}

export function SolarWindDensityWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } = useSolarWind();

  if (isLoading) {
    return (
      <DashboardCard title="SOLAR WIND DENSITY" accent="var(--color-geo-teal)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="SOLAR WIND DENSITY" accent="var(--color-geo-teal)">
        <ErrorFallback error={error} signal="Solar Wind Density" onRetry={refetch} />
      </DashboardCard>
    );
  }

  const latest = (data ?? []).at(-1) ?? null;

  return (
    <DashboardCard title="SOLAR WIND DENSITY" accent="var(--color-geo-teal)">
      {!latest ? (
        <EmptyState message="No density samples" icon="*" />
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[2.5rem] font-bold leading-none text-[var(--color-geo-teal)]">
              {formatNumber(latest.value?.density_p_cm3, 2)}
            </p>
            <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              protons / cm3
            </p>
          </div>
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
              {classifyDensity(latest.value?.density_p_cm3)}
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
              Same NOAA plasma feed as solar wind speed, shared through React Query cache.
            </p>
          </div>
        </div>
      )}

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={latest?.source ?? SOURCE.NOAA_SWPC} />
        <LastUpdatedIndicator timestamp={latest?.timestamp ?? null} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
