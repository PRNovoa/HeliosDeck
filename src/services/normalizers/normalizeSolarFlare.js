import { SOURCE, SIGNAL } from "@/lib/constants.js";
import { flareClassSeverity } from "@/lib/formatters.js";

/**
 * Normalize a NASA DONKI solar flare event into a NormalizedSignal.
 *
 * NASA DONKI raw shape:
 * {
 *   flrID:          "2025-03-16T12:00:00-FLR-001",
 *   instruments:    [{ displayName: "GOES 16: SXI-" }],
 *   beginTime:      "2025-03-16T12:00Z",
 *   peakTime:       "2025-03-16T12:45Z",
 *   endTime:        "2025-03-16T13:00Z",  (may be null)
 *   classType:      "M2.1",
 *   sourceLocation: "N15W30",
 *   activeRegionNum: 13615,
 *   link:           "https://kauai.ccmc.gsfc.nasa.gov/..."
 * }
 *
 * @param {object} raw
 * @returns {NormalizedSignal}
 */
export function normalizeSolarFlare(raw) {
  if (!raw || typeof raw !== "object") {
    return makeError("Null or invalid payload");
  }

  const {
    flrID,
    classType,
    beginTime,
    peakTime,
    endTime,
    sourceLocation,
    instruments,
  } = raw;

  if (!classType) {
    return makeError("Missing classType");
  }

  const timestamp = beginTime ? new Date(beginTime).toISOString() : null;

  return {
    timestamp,
    source: SOURCE.NASA_DONKI,
    signal: SIGNAL.SOLAR_FLARE_EVENTS,
    value: {
      id: flrID ?? null,
      classType,
      severity: flareClassSeverity(classType),
      beginTime: beginTime ? new Date(beginTime).toISOString() : null,
      peakTime: peakTime ? new Date(peakTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      sourceLocation: sourceLocation ?? null,
      instruments: instruments?.map((i) => i.displayName) ?? [],
    },
    unit: "flare_class",
    confidence: 0.95,
    metadata: {
      instrument: instruments?.[0]?.displayName ?? "GOES/XRS",
      cadence_seconds: 60,
    },
    error: null,
  };
}

/**
 * Normalize an array of raw NASA DONKI flare events.
 * Sorts by severity descending (most severe first).
 * @param {object[]} rawArray
 * @returns {NormalizedSignal[]}
 */
export function normalizeSolarFlareArray(rawArray) {
  if (!Array.isArray(rawArray)) return [];
  return rawArray
    .map(normalizeSolarFlare)
    .filter((s) => s.error === null)
    .sort((a, b) => (b.value?.severity ?? 0) - (a.value?.severity ?? 0));
}

function makeError(message) {
  return {
    timestamp: null,
    source: SOURCE.NASA_DONKI,
    signal: SIGNAL.SOLAR_FLARE_EVENTS,
    value: null,
    unit: "flare_class",
    confidence: null,
    metadata: {},
    error: message,
  };
}
