import { useAurora } from "@/hooks/useAurora.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { formatNumber } from "@/lib/formatters.js";

export function AuroraWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } = useAurora();

  if (isLoading) {
    return (
      <DashboardCard title="AURORA PROBABILITY" accent="var(--color-accent-blue)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError || data?.error) {
    return (
      <DashboardCard title="AURORA PROBABILITY" accent="var(--color-accent-blue)">
        <ErrorFallback
          error={isError ? error : data.error}
          signal="Aurora"
          onRetry={refetch}
        />
      </DashboardCard>
    );
  }

  const value = data.value;

  return (
    <DashboardCard title="AURORA PROBABILITY" accent="var(--color-accent-blue)">
      <div className="flex flex-col gap-4">
        <div className="relative h-28 overflow-hidden rounded-lg border border-[rgba(34,211,238,0.15)] bg-[radial-gradient(circle_at_50%_15%,rgba(34,197,94,0.2),transparent_28%),linear-gradient(180deg,rgba(8,20,38,0.9),rgba(2,8,18,0.98))]">
          <div className="absolute inset-x-6 top-8 h-10 rounded-[50%] border border-[rgba(34,197,94,0.35)] shadow-[0_0_28px_rgba(34,197,94,0.22)]" />
          <div className="absolute inset-x-12 bottom-6 h-7 rounded-[50%] border border-[rgba(56,189,248,0.28)]" />
          {value.sample_points.slice(0, 18).map((point) => (
            <span
              key={`${point.longitude}-${point.latitude}`}
              className="absolute h-1 w-1 rounded-full bg-[var(--color-accent-green)] opacity-70 shadow-[0_0_8px_var(--color-accent-green)]"
              style={{
                left: `${((point.longitude + 180) / 360) * 100}%`,
                top: `${(1 - (point.latitude + 90) / 180) * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Metric label="Max" value={formatNumber(value.max_probability_pct, 0)} unit="%" />
          <Metric label="North" value={formatNumber(value.northern_max_pct, 0)} unit="%" />
          <Metric label="South" value={formatNumber(value.southern_max_pct, 0)} unit="%" />
        </div>
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">
          Peak model probability near {formatNumber(Math.abs(value.max_latitude), 0)}
          deg {value.max_latitude >= 0 ? "N" : "S"}.
        </p>
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={data.source} />
        <LastUpdatedIndicator timestamp={data.timestamp} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-2">
      <p className="text-[0.52rem] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
        {value} <span className="text-[0.62rem] text-[var(--color-text-muted)]">{unit}</span>
      </p>
    </div>
  );
}
