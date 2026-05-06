import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSolarFlares } from "@/hooks/useSolarFlares.js";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { EmptyState } from "@/components/ui/EmptyState.jsx";

const CLASS_COLOURS = {
  X: "#ff4500",
  M: "#ffa500",
  C: "#ffd700",
  B: "#00e5ff",
  A: "#555580",
};

function getCellColour(classType) {
  const letter = classType?.charAt(0).toUpperCase();
  return CLASS_COLOURS[letter] ?? CLASS_COLOURS.A;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="border border-[#2a2a5a] bg-[#111128] px-2.5 py-1.5 font-mono text-[10px] text-[#9090b8]">
      <p style={{ color: getCellColour(d.classType), marginBottom: 2 }}>
        {d.classType}
      </p>
      <p>Severity: {d.severity.toFixed(1)}</p>
      {d.location && <p>Location: {d.location}</p>}
    </div>
  );
};

/**
 * SolarFlareSeverityChart
 * -------------------------------------------------------
 * Bar chart of solar flare events for the last N days,
 * coloured by flare class (X=red, M=amber, C=gold, B=cyan, A=grey).
 * Uses Recharts. Reads from the same React Query cache as SolarFlareWidget.
 *
 * Props:
 *   days {number} - how many days back to query (default 7)
 */
export function SolarFlareSeverityChart({ days = 7 }) {
  const { data, isLoading } = useSolarFlares(days);

  if (isLoading) return <SkeletonBlock lines={6} />;

  const events = data ?? [];

  if (events.length === 0) {
    return (
      <EmptyState message={`No flares in the last ${days} days`} icon="*" />
    );
  }

  const chartData = [...events].reverse().map((s) => ({
    classType: s.value?.classType ?? "?",
    severity: s.value?.severity ?? 0,
    location: s.value?.sourceLocation ?? null,
  }));

  const mostSevere = events[0]?.value?.classType ?? "N/A";
  const xCount = events.filter((s) => s.value?.classType?.charAt(0) === "X").length;
  const mCount = events.filter((s) => s.value?.classType?.charAt(0) === "M").length;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-solar-amber)]">
        FLARE SEVERITY - LAST {days} DAYS
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
        >
          <XAxis
            dataKey="classType"
            tick={{ fontSize: 8, fontFamily: "Courier New", fill: "#9090b8" }}
            axisLine={{ stroke: "#2a2a5a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 8, fontFamily: "Courier New", fill: "#9090b8" }}
            axisLine={{ stroke: "#2a2a5a" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,215,0,0.05)" }} />
          <Bar dataKey="severity" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={getCellColour(entry.classType)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p
        className="max-w-[60ch] font-mono text-xs leading-normal text-[var(--color-text-secondary)]"
        aria-label="Chart summary"
      >
        {events.length} event{events.length !== 1 ? "s" : ""} detected.
        Most severe: <strong>{mostSevere}</strong>.
        {xCount > 0 && (
          <>
            {" "}
            <span style={{ color: "#ff4500" }}>{xCount} X-class</span> -
            strong radio blackout risk.
          </>
        )}
        {mCount > 0 && !xCount && (
          <>
            {" "}
            <span style={{ color: "#ffa500" }}>{mCount} M-class</span> -
            elevated geomagnetic watch.
          </>
        )}
      </p>

      <ul
        className="m-0 flex list-none flex-wrap gap-3 p-0"
        aria-label="Flare class colour legend"
      >
        {Object.entries(CLASS_COLOURS).map(([cls, col]) => (
          <li
            key={cls}
            className="flex items-center gap-1 font-mono text-xs text-[var(--color-text-secondary)]"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-[1px]"
              style={{ background: col }}
              aria-hidden="true"
            />
            {cls}-class
          </li>
        ))}
      </ul>
    </div>
  );
}
