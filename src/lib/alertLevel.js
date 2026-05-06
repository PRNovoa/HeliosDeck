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
 * @returns {{ level: string, reason: string }}
 */
export function computeAlertLevel({ kpData, solarFlareData, issData }) {
  const kpOk = kpData && !kpData.error;
  const flareOk = Array.isArray(solarFlareData) && solarFlareData.length >= 0;
  const issOk = issData && !issData.error;

  // ── SIGNAL_LOST ──────────────────────────────────────────────────────────
  if (!kpOk && !flareOk && !issOk) {
    return { level: ALERT_LEVEL.SIGNAL_LOST, reason: "No live signals available" };
  }

  const kp = kpData?.value?.kp ?? 0;

  // ── Check for X-class flare ──────────────────────────────────────────────
  const hasXClass =
    flareOk &&
    solarFlareData.some((s) => s.value?.classType?.charAt(0) === "X");

  // ── Check for M-class flare ──────────────────────────────────────────────
  const hasMClass =
    flareOk &&
    solarFlareData.some((s) => s.value?.classType?.charAt(0) === "M");

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

  // ── CALM ─────────────────────────────────────────────────────────────────
  return { level: ALERT_LEVEL.CALM, reason: "Geomagnetic conditions nominal" };
}
