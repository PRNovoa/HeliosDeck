import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSolarWind } from "@/hooks/useSolarWind.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { formatNumber } from "@/lib/formatters.js";
import { SOURCE } from "@/lib/constants.js";

function classifySpeed(speed) {
  if (speed == null) return "unknown";
  if (speed < 350) return "slow";
  if (speed <= 500) return "nominal";
  if (speed <= 700) return "elevated";
  return "high-speed stream";
}

export function SolarWindWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } = useSolarWind();

  if (isLoading) {
    return (
      <DashboardCard title="SOLAR WIND" accent="var(--color-accent-cyan)">
        <SkeletonBlock lines={4} />
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardCard title="SOLAR WIND" accent="var(--color-accent-cyan)">
        <ErrorFallback error={error} signal="Solar Wind" onRetry={refetch} />
      </DashboardCard>
    );
  }

  const samples = data ?? [];
  const latest = samples.at(-1) ?? null;

  if (!latest) {
    return (
      <DashboardCard title="SOLAR WIND" accent="var(--color-accent-cyan)">
        <EmptyState message="No solar wind samples" icon="*" />
        <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
          <SourceBadge source={SOURCE.NOAA_SWPC} />
          <LastUpdatedIndicator timestamp={null} isFetching={isFetching} />
        </footer>
      </DashboardCard>
    );
  }

  const chartData = samples.slice(-36).map((sample) => ({
    time: sample.timestamp?.substring(11, 16) ?? "",
    speed: sample.value?.speed_km_s,
  }));
  const speed = latest.value?.speed_km_s;
  const interpretation = classifySpeed(speed);

  return (
    <DashboardCard title="SOLAR WIND" accent="var(--color-accent-cyan)">
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[2.4rem] font-bold leading-none text-[var(--color-accent-cyan)]">
              {formatNumber(speed, 0)}
            </p>
            <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              km/s speed
            </p>
          </div>
          <span className="rounded-full border border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.1)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-cyan)]">
            {interpretation}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-2">
          <Metric label="Density" value={formatNumber(latest.value?.density_p_cm3, 2)} unit="p/cm3" />
          <Metric label="Temp" value={formatNumber(latest.value?.temperature_k, 0)} unit="K" />
        </dl>

        {chartData.some((point) => point.speed != null) && (
          <div className="h-24 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
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
                  dataKey="speed"
                  stroke="var(--color-accent-cyan)"
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

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-inner)] p-2">
      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm font-semibold text-[var(--color-text-primary)]">
        {value} <span className="text-[0.65rem] text-[var(--color-text-muted)]">{unit}</span>
      </dd>
    </div>
  );
}
