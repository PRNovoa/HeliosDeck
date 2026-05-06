import { SOURCE, SIGNAL } from "@/lib/constants.js";

/**
 * Normalize raw ISS API payload into a NormalizedSignal.
 *
 * Raw shape (wheretheiss.at):
 * {
 *   name:        "iss",
 *   id:          25544,
 *   latitude:    48.32,
 *   longitude:   -23.11,
 *   altitude:    408.2,      (km)
 *   velocity:    27580.4,    (km/h)
 *   visibility:  "eclipsed",
 *   footprint:   2562.0,
 *   timestamp:   1710594600, (Unix seconds)
 *   daynum:      2460386.1,
 *   solar_lat:   -1.68,
 *   solar_lon:   291.83,
 *   units:       "kilometers"
 * }
 *
 * @param {object|null} raw
 * @returns {NormalizedSignal}
 */
export function normalizeISS(raw) {
  // Guard: missing or malformed payload
  if (!raw || typeof raw !== "object") {
    return makeError("Received null or non-object payload");
  }

  const { latitude, longitude, altitude, velocity, timestamp, visibility } =
    raw;

  // Validate required fields
  if (latitude == null || longitude == null) {
    return makeError("Missing latitude or longitude");
  }

  const parsedLat = parseFloat(latitude);
  const parsedLon = parseFloat(longitude);

  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    return makeError(`Invalid lat/lon: ${latitude}, ${longitude}`);
  }

  const isoTimestamp = timestamp
    ? parseUnixTimestamp(timestamp)
    : new Date().toISOString();

  if (!isoTimestamp) {
    return makeError(`Invalid timestamp: ${timestamp}`);
  }

  return {
    timestamp: isoTimestamp,
    source: SOURCE.ISS_API,
    signal: SIGNAL.ISS_COORDINATES,
    value: {
      latitude: parsedLat,
      longitude: parsedLon,
      altitude_km: toNullableNumber(altitude),
      velocity_kmh: toNullableNumber(velocity),
      visibility: visibility ?? null,
    },
    unit: "degrees_lat_lon",
    confidence: 0.99,
    metadata: {
      instrument: "ISS ZARYA transponder",
      cadence_seconds: 5,
      norad_id: raw.id ?? 25544,
    },
    error: null,
  };
}

// ── Private helpers ───────────────────────────────────────────────────────────

function parseUnixTimestamp(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return null;
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Build a NormalizedSignal with error set and null value.
 * @param {string} message
 * @returns {NormalizedSignal}
 */
function makeError(message) {
  return {
    timestamp: null,
    source: SOURCE.ISS_API,
    signal: SIGNAL.ISS_COORDINATES,
    value: null,
    unit: "degrees_lat_lon",
    confidence: null,
    metadata: {},
    error: message,
  };
}

/**
 * @typedef {object} NormalizedSignal
 * @property {string|null} timestamp   — ISO 8601 UTC
 * @property {string}      source      — SOURCE constant
 * @property {string}      signal      — SIGNAL constant
 * @property {object|null} value       — signal-specific data
 * @property {string}      unit        — human-readable unit
 * @property {number|null} confidence  — 0–1 or null
 * @property {object}      metadata    — instrument/cadence info
 * @property {string|null} error       — error message or null
 */
