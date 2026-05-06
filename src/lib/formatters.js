import { KP_LEVEL } from "./constants.js";

// ── Timestamp helpers ────────────────────────────────────────────────────────

/**
 * Parse any date-ish value to a Date object.
 * Returns null if unparseable.
 * @param {string|number|Date|null|undefined} raw
 * @returns {Date|null}
 */
export function parseTimestamp(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a Date (or ISO string) as a short UTC label.
 * e.g. "16 MAR 2025  14:30 UTC"
 * @param {Date|string|null} value
 * @returns {string}
 */
export function formatTimestamp(value) {
  const d = parseTimestamp(value);
  if (!d) return "N/A";
  return d
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    })
    .toUpperCase();
}

/**
 * Format a timestamp as a relative human string.
 * e.g. "3 minutes ago", "2 hours ago"
 * @param {Date|string|null} value
 * @returns {string}
 */
export function formatRelativeTime(value) {
  const d = parseTimestamp(value);
  if (!d) return "Unknown";

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

// ── Number helpers ───────────────────────────────────────────────────────────

/**
 * Format a number with fixed decimal places.
 * Returns 'N/A' if value is null/undefined/NaN.
 * @param {number|null|undefined} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatNumber(value, decimals = 2) {
  if (value == null || isNaN(value)) return "N/A";
  return Number(value).toFixed(decimals);
}

/**
 * Format a latitude/longitude pair.
 * e.g. "48.32°N  23.11°W"
 * @param {number} lat
 * @param {number} lon
 * @returns {string}
 */
export function formatLatLon(lat, lon) {
  if (lat == null || lon == null) return "N/A";
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${latDir}  ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

// ── Kp Index helpers ─────────────────────────────────────────────────────────

/**
 * Classify a numeric Kp value into a named level.
 * @param {number} kp
 * @returns {string} — one of KP_LEVEL values
 */
export function classifyKp(kp) {
  if (kp == null || isNaN(kp)) return KP_LEVEL.QUIET;
  if (kp >= 9) return KP_LEVEL.EXTREME;
  if (kp >= 8) return KP_LEVEL.SEVERE;
  if (kp >= 7) return KP_LEVEL.STRONG;
  if (kp >= 6) return KP_LEVEL.MODERATE;
  if (kp >= 5) return KP_LEVEL.MINOR;
  if (kp >= 4) return KP_LEVEL.ACTIVE;
  if (kp >= 3) return KP_LEVEL.UNSETTLED;
  return KP_LEVEL.QUIET;
}

/**
 * Return the CSS custom-property name for a Kp level colour.
 * e.g. classifyKp(5) → "--color-kp-5"
 * @param {number} kp
 * @returns {string}
 */
export function kpColourVar(kp) {
  const index = Math.min(9, Math.max(0, Math.round(kp ?? 0)));
  return `var(--color-kp-${index})`;
}

// ── Solar flare helpers ──────────────────────────────────────────────────────

/**
 * Return numeric severity for a flare class string.
 * Higher = more severe. Used for sorting.
 * @param {string} classType  e.g. "M2.1", "X1.0"
 * @returns {number}
 */
export function flareClassSeverity(classType) {
  if (!classType) return 0;
  const letters = { A: 1, B: 2, C: 3, M: 4, X: 5 };
  const letter = classType.charAt(0).toUpperCase();
  const numeric = parseFloat(classType.slice(1)) || 1;
  return (letters[letter] || 0) * 10 + numeric;
}
