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
  if (!Array.isArray(row) || row.length < 2) {
    return makeError("Invalid row format");
  }

  const [timeTag, kpRaw, status] = row;
  const kp = parseFloat(kpRaw);

  if (isNaN(kp)) {
    return makeError(`Invalid Kp value: ${kpRaw}`);
  }

  const timestamp = timeTag ? new Date(timeTag + " UTC").toISOString() : null;

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
    },
    error: null,
  };
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
