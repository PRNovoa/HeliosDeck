/**
 * NormalizedSignal — Universal data contract for all Helios Deck signals.
 *
 * Every API client produces raw, provider-specific data.
 * Every normalizer converts that raw data into this shape.
 * Widgets, pages and tests only ever interact with NormalizedSignal objects.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  API Client  →  raw data                                         │
 * │  Normalizer  →  NormalizedSignal                                 │
 * │  React Query →  cache + refetch                                  │
 * │  Widget      →  reads NormalizedSignal, renders UI               │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @typedef {Object} NormalizedSignal
 * @property {string|null} timestamp  - ISO 8601 UTC string. null when missing.
 * @property {string}      source     - SOURCE constant. Identifies the provider.
 * @property {string}      signal     - SIGNAL constant. Identifies measurement type.
 * @property {object|null} value      - Signal-specific payload. null when error set.
 * @property {string}      unit       - Physical unit e.g. "Kp", "degrees_lat_lon".
 * @property {number|null} confidence - Quality in [0,1]. null if unavailable.
 * @property {object}      metadata   - Provenance: instrument, cadence, NORAD ID…
 * @property {string|null} error      - Human-readable error. null on success.
 */

/**
 * Create a NormalizedSignal representing a fetch or parse error.
 *
 * Use inside normalizers when the raw payload is invalid or missing.
 *
 * @param {string} signal  - SIGNAL constant
 * @param {string} source  - SOURCE constant
 * @param {string} message - Human-readable description of the problem
 * @returns {NormalizedSignal}
 */
export function createSignalError(signal, source, message) {
  return {
    timestamp: null,
    source,
    signal,
    value: null,
    unit: "unknown",
    confidence: null,
    metadata: {},
    error: message,
  };
}

/**
 * Validate that an object conforms to the NormalizedSignal shape.
 * All eight top-level keys must be present (values may be null).
 *
 * @param {unknown} obj
 * @returns {boolean}
 */
export function isValidNormalizedSignal(obj) {
  if (!obj || typeof obj !== "object") return false;
  const required = [
    "timestamp",
    "source",
    "signal",
    "value",
    "unit",
    "confidence",
    "metadata",
    "error",
  ];
  return required.every((k) =>
    Object.prototype.hasOwnProperty.call(obj, k),
  );
}
