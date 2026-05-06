import { SOURCE, SIGNAL } from "@/lib/constants.js";

export function normalizeCME(raw) {
  if (!raw || typeof raw !== "object") {
    return makeError("Invalid CME payload");
  }

  const timestamp = parseTimestamp(raw.startTime ?? raw.eventTime);
  if (!timestamp) return makeError("Missing CME event time");

  const analysis = Array.isArray(raw.cmeAnalyses) ? raw.cmeAnalyses[0] : null;
  const speed = toNullableNumber(analysis?.speed);

  return {
    timestamp,
    source: SOURCE.NASA_DONKI,
    signal: SIGNAL.CORONAL_MASS_EJECTIONS,
    value: {
      id: raw.activityID ?? null,
      catalog: raw.catalog ?? null,
      speed_km_s: speed,
      type: analysis?.type ?? null,
      latitude: toNullableNumber(analysis?.latitude),
      longitude: toNullableNumber(analysis?.longitude),
      halfAngle: toNullableNumber(analysis?.halfAngle),
      note: raw.note ?? analysis?.note ?? null,
      instruments: raw.instruments?.map((item) => item.displayName).filter(Boolean) ?? [],
      link: raw.link ?? null,
      activityLevel: classifySpeed(speed),
    },
    unit: "km/s",
    confidence: null,
    metadata: {
      provider: "NASA DONKI",
      cadence_seconds: 3600,
      analysis_model: analysis?.modelCompletionTime ?? null,
    },
    error: null,
  };
}

export function normalizeCMEArray(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeCME)
    .filter((signal) => signal.error === null)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function classifySpeed(speed) {
  if (speed === null) return "unknown";
  if (speed >= 1500) return "extreme";
  if (speed >= 1000) return "fast";
  if (speed >= 500) return "moderate";
  return "slow";
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function makeError(message) {
  return {
    timestamp: null,
    source: SOURCE.NASA_DONKI,
    signal: SIGNAL.CORONAL_MASS_EJECTIONS,
    value: null,
    unit: "km/s",
    confidence: null,
    metadata: {},
    error: message,
  };
}
