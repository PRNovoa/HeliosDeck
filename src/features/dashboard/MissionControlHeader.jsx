import { motion } from "framer-motion";
import { RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { useKpIndex } from "@/hooks/useKpIndex.js";
import { useSolarFlares } from "@/hooks/useSolarFlares.js";
import { useISSPosition } from "@/hooks/useISSPosition.js";
import { useSpaceWeatherAlerts } from "@/hooks/useSpaceWeatherAlerts.js";
import { useSolarWind } from "@/hooks/useSolarWind.js";
import { useDashboard } from "@/context/useDashboard.js";
import { computeAlertLevel, ALERT_COLOURS } from "@/lib/alertLevel.js";
import { formatRelativeTime } from "@/lib/formatters.js";

export function MissionControlHeader({ onConfigure, panelOpen }) {
  const { data: kpData } = useKpIndex();
  const { data: flareData } = useSolarFlares(7);
  const { data: issData } = useISSPosition();
  const { data: alertData } = useSpaceWeatherAlerts();
  const { data: windData } = useSolarWind();
  const { getSortedWidgets, resetLayout } = useDashboard();

  const { level, reason } = computeAlertLevel({
    kpData: kpData ?? null,
    solarFlareData: flareData ?? null,
    issData: issData ?? null,
    spaceWeatherAlerts: alertData ?? null,
    solarWindData: windData ?? null,
  });

  const enabledWidgets = getSortedWidgets(true).length;
  const liveSources = [kpData, flareData, issData, alertData, windData].filter(
    Boolean,
  ).length;

  const timestamps = [
    kpData?.timestamp,
    issData?.timestamp,
    flareData?.[0]?.timestamp,
    alertData?.[0]?.timestamp,
    windData?.at(-1)?.timestamp,
  ].filter(Boolean);
  const latestMs = timestamps.length
    ? Math.max(
        ...timestamps.map((t) => new Date(t).getTime()).filter(Number.isFinite),
      )
    : null;
  const lastSync = latestMs ? formatRelativeTime(latestMs) : "Waiting";
  const alertColour = ALERT_COLOURS[level];

  return (
    <motion.header
      className="relative flex flex-col gap-5 px-1 pt-1 lg:flex-row lg:items-end lg:justify-between"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-3xl">
        <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-[var(--color-accent-cyan)]">
          <Sparkles size={13} />
          Live Constellation Deck
        </div>
        <h1 className="text-4xl font-semibold leading-none text-[var(--color-text-primary)] md:text-5xl">
          Helios observatory
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
          A calm mission board for orbital position, solar weather, and the
          quiet signals between them.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <div
          className="flex h-11 items-center gap-2 rounded-full border px-4 text-[0.68rem] font-bold uppercase tracking-widest shadow-[var(--surface-shadow)] backdrop-blur-2xl"
          style={{
            color: alertColour,
            borderColor: `color-mix(in srgb, ${alertColour} 42%, transparent)`,
            background: `color-mix(in srgb, ${alertColour} 10%, var(--surface-glass))`,
          }}
          title={reason}
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-current" />
          {level}
        </div>

        <Metric label="Widgets" value={enabledWidgets} />
        <Metric label="Sources" value={`${liveSources}/5`} />
        <Metric label="Sync" value={lastSync} />

        <button
          className="flex h-11 items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-control)] px-4 text-[0.68rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] shadow-[var(--surface-shadow)] backdrop-blur-2xl transition-colors hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)]"
          onClick={resetLayout}
          aria-label="Reset dashboard layout"
        >
          <RotateCcw size={14} />
          Layout
        </button>

        <button
          className={[
            "flex h-11 items-center gap-2 rounded-full border px-4 text-[0.68rem] font-bold uppercase tracking-widest shadow-[var(--surface-shadow)] backdrop-blur-2xl transition-colors",
            panelOpen
              ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-dim)] text-[var(--color-accent-orange)]"
              : "border-[var(--surface-border)] bg-[var(--surface-control)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]",
          ].join(" ")}
          onClick={onConfigure}
          aria-expanded={panelOpen}
          aria-label="Configure dashboard widgets"
        >
          <SlidersHorizontal size={14} />
          {panelOpen ? "Close" : "Configure"}
        </button>
      </div>
    </motion.header>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex h-11 items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-control)] px-4 shadow-[var(--surface-shadow)] backdrop-blur-2xl">
      <span className="mr-2 text-[0.6rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
  );
}
