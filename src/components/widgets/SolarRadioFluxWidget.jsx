import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSolarRadioFlux } from "@/hooks/useSolarRadioFlux.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { formatNumber } from "@/lib/formatters.js";
import { SOURCE } from "@/lib/constants.js";

export function SolarRadioFluxWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSolarRadioFlux();

  if (isLoading) {
    return (
      <DashboardCard title="SOLAR RADIO FLUX" accent="var(--color-solar-gold)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="SOLAR RADIO FLUX" accent="var(--color-solar-gold)">
        <ErrorFallback error={error} signal="Solar Radio Flux" onRetry={refetch} />
      </DashboardCard>
    );
  }

  const samples = data ?? [];
  const latest = samples.at(-1) ?? null;

  if (!latest) {
    return (
      <DashboardCard title="SOLAR RADIO FLUX" accent="var(--color-solar-gold)">
        <EmptyState message="No F10.7 flux samples" icon="*" />
        <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
          <SourceBadge source={SOURCE.NOAA_SWPC} />
          <LastUpdatedIndicator timestamp={null} isFetching={isFetching} />
        </footer>
      </DashboardCard>
    );
  }

  const chartData = samples.slice(-24).map((sample) => ({
    time: sample.timestamp?.slice(5, 10) ?? "",
    flux: sample.value?.flux_sfu,
  }));

  return (
    <DashboardCard title="SOLAR RADIO FLUX" accent="var(--color-solar-gold)">
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[2.4rem] font-bold leading-none text-[var(--color-solar-gold)]">
              {formatNumber(latest.value?.flux_sfu, 0)}
            </p>
            <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              SFU at 10.7 cm
            </p>
          </div>
          <span className="rounded-full border border-[rgba(245,158,11,0.38)] bg-[rgba(245,158,11,0.12)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[var(--color-solar-gold)]">
            {latest.value?.activityLevel ?? "unknown"}
          </span>
        </div>

        <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
          F10.7 cm radio flux is a solar activity proxy.
        </p>

        {chartData.length > 1 && (
          <div className="h-24 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--color-text-primary)",
                  }}
                  labelStyle={{ color: "var(--color-text-secondary)" }}
                />
                <Line
                  type="monotone"
                  dataKey="flux"
                  stroke="var(--color-solar-gold)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={latest.source} />
        <LastUpdatedIndicator timestamp={latest.timestamp} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
