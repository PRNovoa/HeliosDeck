/**
 * Alert Level system — derives a single threat level from multiple live signals.
 *
 * Levels (in ascending severity):
 *   CALM        — Nominal geomagnetic conditions
 *   WATCH       — Elevated activity, monitor closely
 *   STORM       — Active geomagnetic storm or major solar event
 *   SIGNAL_LOST — No live data available (all signals errored or null)
 */

export const ALERT_LEVEL = {
  CALM: "CALM",
  WATCH: "WATCH",
  STORM: "STORM",
  SIGNAL_LOST: "SIGNAL_LOST",
};

export const ALERT_COLOURS = {
  [ALERT_LEVEL.CALM]: "var(--color-geo-green)",
  [ALERT_LEVEL.WATCH]: "var(--color-solar-amber)",
  [ALERT_LEVEL.STORM]: "var(--color-solar-red)",
  [ALERT_LEVEL.SIGNAL_LOST]: "var(--color-text-muted)",
};

/**
 * Compute the overall alert level from available live signal data.
 *
 * @param {object} params
 * @param {import("@/lib/normalizedSignal.js").NormalizedSignal|null} params.kpData
 * @param {import("@/lib/normalizedSignal.js").NormalizedSignal[]|null} params.solarFlareData
 * @param {import("@/lib/normalizedSignal.js").NormalizedSignal|null} params.issData
 * @param {import("@/lib/normalizedSignal.js").NormalizedSignal[]|null} params.spaceWeatherAlerts
 * @param {import("@/lib/normalizedSignal.js").NormalizedSignal[]|null} params.solarWindData
 * @returns {{ level: string, reason: string }}
 */
export function computeAlertLevel({
  kpData,
  solarFlareData,
  issData,
  spaceWeatherAlerts,
  solarWindData,
}) {
  const kpOk = kpData && !kpData.error;
  const flareOk = Array.isArray(solarFlareData) && solarFlareData.length >= 0;
  const issOk = issData && !issData.error;
  const alertsOk = Array.isArray(spaceWeatherAlerts);
  const windOk = Array.isArray(solarWindData) && solarWindData.length > 0;

  // ── SIGNAL_LOST ──────────────────────────────────────────────────────────
  if (!kpOk && !flareOk && !issOk && !alertsOk && !windOk) {
    return { level: ALERT_LEVEL.SIGNAL_LOST, reason: "No live signals available" };
  }

  const kp = kpData?.value?.kp ?? 0;
  const latestWind = windOk ? solarWindData.at(-1) : null;
  const solarWindSpeed = latestWind?.value?.speed_km_s ?? 0;

  // ── Check for X-class flare ──────────────────────────────────────────────
  const hasXClass =
    flareOk &&
    solarFlareData.some((s) => s.value?.classType?.charAt(0) === "X");

  // ── Check for M-class flare ──────────────────────────────────────────────
  const hasMClass =
    flareOk &&
    solarFlareData.some((s) => s.value?.classType?.charAt(0) === "M");

  const highNoaaAlert =
    alertsOk &&
    spaceWeatherAlerts.some((s) => {
      const type = s.value?.messageType;
      return s.value?.severity === "high" && (type === "WARNING" || type === "ALERT");
    });

  const watchNoaaAlert =
    alertsOk &&
    spaceWeatherAlerts.some(
      (s) => s.value?.messageType === "WATCH" || s.value?.severity === "medium",
    );

  // ── STORM ────────────────────────────────────────────────────────────────
  if (kp >= 7) {
    return {
      level: ALERT_LEVEL.STORM,
      reason: `Kp ${kp.toFixed(1)} — Severe geomagnetic storm`,
    };
  }
  if (hasXClass) {
    return { level: ALERT_LEVEL.STORM, reason: "X-class solar flare detected" };
  }
  if (highNoaaAlert) {
    return { level: ALERT_LEVEL.STORM, reason: "NOAA warning or alert active" };
  }
  if (solarWindSpeed > 700) {
    return {
      level: ALERT_LEVEL.STORM,
      reason: `Solar wind ${solarWindSpeed.toFixed(0)} km/s`,
    };
  }

  // ── WATCH ────────────────────────────────────────────────────────────────
  if (kp >= 5) {
    return {
      level: ALERT_LEVEL.WATCH,
      reason: `Kp ${kp.toFixed(1)} — Minor storm watch`,
    };
  }
  if (hasMClass) {
    return { level: ALERT_LEVEL.WATCH, reason: "M-class solar flare activity" };
  }
  if (watchNoaaAlert) {
    return { level: ALERT_LEVEL.WATCH, reason: "NOAA space weather watch active" };
  }
  if (solarWindSpeed > 500) {
    return {
      level: ALERT_LEVEL.WATCH,
      reason: `Solar wind ${solarWindSpeed.toFixed(0)} km/s`,
    };
  }

  // ── CALM ─────────────────────────────────────────────────────────────────
  return { level: ALERT_LEVEL.CALM, reason: "Geomagnetic conditions nominal" };
}
