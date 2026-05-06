import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSolarRadiation } from "@/hooks/useSolarRadiation.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { SOURCE } from "@/lib/constants.js";

export function SolarRadiationWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSolarRadiation();

  if (isLoading) {
    return (
      <DashboardCard title="SOLAR RADIATION" accent="var(--color-solar-gold)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="SOLAR RADIATION" accent="var(--color-solar-gold)">
        <ErrorFallback error={error} signal="Solar Radiation" onRetry={refetch} />
      </DashboardCard>
    );
  }

  const samples = data ?? [];
  const latest = samples.at(-1) ?? null;

  if (!latest) {
    return (
      <DashboardCard title="SOLAR RADIATION" accent="var(--color-solar-gold)">
        <EmptyState message="No X-ray flux samples" icon="*" />
      </DashboardCard>
    );
  }

  const chartData = samples.slice(-48).map((sample) => ({
    time: sample.timestamp?.substring(11, 16) ?? "",
    flux: sample.value?.flux_w_m2,
  }));

  return (
    <DashboardCard title="SOLAR RADIATION" accent="var(--color-solar-gold)">
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[2.25rem] font-bold leading-none text-[var(--color-solar-gold)]">
              {latest.value.xrayClass}
            </p>
            <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              GOES X-ray class
            </p>
          </div>
          <span className="font-mono text-[0.7rem] text-[var(--color-text-secondary)]">
            {latest.value.flux_w_m2.toExponential(2)} W/m2
          </span>
        </div>

        <div className="h-24 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={["dataMin", "dataMax"]} scale="log" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--color-text-primary)",
                }}
                formatter={(value) => Number(value).toExponential(2)}
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
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={latest?.source ?? SOURCE.NOAA_SWPC} />
        <LastUpdatedIndicator timestamp={latest?.timestamp ?? null} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
