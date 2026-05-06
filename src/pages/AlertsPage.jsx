import { AlertTriangle, Bell } from "lucide-react";
import { useISSPosition } from "@/hooks/useISSPosition.js";
import { useKpIndex } from "@/hooks/useKpIndex.js";
import { useSolarFlares } from "@/hooks/useSolarFlares.js";
import { useSolarWind } from "@/hooks/useSolarWind.js";
import { useSpaceWeatherAlerts } from "@/hooks/useSpaceWeatherAlerts.js";
import { ALERT_COLOURS, computeAlertLevel } from "@/lib/alertLevel.js";
import { formatTimestamp } from "@/lib/formatters.js";

const panel =
  "rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass)] p-4 shadow-[var(--surface-shadow)] backdrop-blur-2xl";

export function AlertsPage() {
  const { data: kpData } = useKpIndex();
  const { data: flareData } = useSolarFlares(7);
  const { data: issData } = useISSPosition();
  const { data: alertData } = useSpaceWeatherAlerts();
  const { data: windData } = useSolarWind();

  const { level, reason } = computeAlertLevel({
    kpData: kpData ?? null,
    solarFlareData: flareData ?? null,
    issData: issData ?? null,
    spaceWeatherAlerts: alertData ?? null,
    solarWindData: windData ?? null,
  });
  const colour = ALERT_COLOURS[level];
  const alerts = alertData ?? [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header className={panel}>
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-cyan)]">
          <Bell size={14} />
          Alert Center
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold" style={{ color: colour }}>
              {level}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{reason}</p>
          </div>
          <span
            className="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest"
            style={{
              color: colour,
              borderColor: `color-mix(in srgb, ${colour} 45%, transparent)`,
              background: `color-mix(in srgb, ${colour} 10%, transparent)`,
            }}
          >
            Live rule engine
          </span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]" aria-label="Alert details">
        <div className={panel}>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
            Rule inputs
          </h2>
          <ul className="flex flex-col gap-3">
            <Rule label="Kp storm threshold" value={kpData?.value?.kp ?? "waiting"} />
            <Rule label="Solar flare class" value={flareData?.[0]?.value?.classType ?? "none"} />
            <Rule label="Solar wind speed" value={windData?.at(-1)?.value?.speed_km_s ?? "waiting"} />
            <Rule label="NOAA alert count" value={alerts.length} />
          </ul>
        </div>

        <div className={panel}>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
            <AlertTriangle size={16} />
            NOAA messages
          </h2>
          {alerts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No active NOAA alerts.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {alerts.slice(0, 5).map((alert) => (
                <li
                  key={`${alert.value.productId}-${alert.value.serialNumber}-${alert.timestamp}`}
                  className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-inner)] p-3"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent-amber)]">
                    {alert.value.messageType} / {alert.value.severity}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                    {alert.value.title}
                  </p>
                  <time className="mt-2 block font-mono text-[0.62rem] text-[var(--color-text-muted)]">
                    {formatTimestamp(alert.timestamp)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Rule({ label, value }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-inner)] px-3 py-2">
      <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
        {String(value)}
      </span>
    </li>
  );
}
