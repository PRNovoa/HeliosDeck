import { SOURCE, SIGNAL } from "@/lib/constants.js";
import { classifyKp } from "@/lib/formatters.js";

/**
 * Normalize a single NOAA Kp index row into a NormalizedSignal.
 *
 * NOAA returns a JSON array of arrays.
 * Row format: [time_tag, Kp, status]
 * e.g. ["2025-03-16 15:00:00.000", "4.00", "observed"]
 *
 * Pass the LAST element of the array (most recent) as `raw`.
 *
 * @param {string[]} row — single NOAA Kp row
 * @returns {NormalizedSignal}
 */
export function normalizeKpIndex(row) {
  if (!row || typeof row !== "object") {
    return makeError("Invalid row format");
  }

  const isArrayRow = Array.isArray(row);
  if (isArrayRow && row.length < 2) {
    return makeError("Invalid row format");
  }

  const timeTag = isArrayRow ? row[0] : row.time_tag;
  const kpRaw = isArrayRow ? row[1] : row.Kp;
  const status = isArrayRow ? row[2] : row.status;
  const kp = parseFloat(kpRaw);

  if (isNaN(kp)) {
    return makeError(`Invalid Kp value: ${kpRaw}`);
  }

  const timestamp = parseNoaaTimestamp(timeTag);

  if (!timestamp) {
    return makeError(`Invalid Kp timestamp: ${timeTag}`);
  }

  return {
    timestamp,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.KP_INDEX,
    value: {
      kp,
      level: classifyKp(kp),
      status: status ?? "unknown",
    },
    unit: "Kp",
    confidence: null,
    metadata: {
      instrument: "NOAA planetary Kp network",
      a_running: isArrayRow ? null : row.a_running ?? null,
      station_count: isArrayRow ? null : row.station_count ?? null,
    },
    error: null,
  };
}

function parseNoaaTimestamp(value) {
  if (!value) return null;
  const raw = String(value);
  const date = new Date(raw.includes("T") ? `${raw}Z` : `${raw} UTC`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function makeError(message) {
  return {
    timestamp: null,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.KP_INDEX,
    value: null,
    unit: "Kp",
    confidence: null,
    metadata: {},
    error: message,
  };
}
