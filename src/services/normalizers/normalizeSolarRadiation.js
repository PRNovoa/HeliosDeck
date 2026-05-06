import { SOURCE, SIGNAL } from "@/lib/constants.js";

export function normalizeSolarRadiation(raw) {
  if (!raw || typeof raw !== "object") {
    return makeError("Invalid radiation payload");
  }

  const timestamp = parseTimestamp(raw.time_tag);
  const flux = toNullableNumber(raw.flux);

  if (!timestamp) return makeError("Invalid radiation timestamp");
  if (flux === null) return makeError("Missing radiation flux");

  return {
    timestamp,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SOLAR_RADIATION,
    value: {
      flux_w_m2: flux,
      observed_flux_w_m2: toNullableNumber(raw.observed_flux),
      electron_correction: toNullableNumber(raw.electron_correction),
      electron_contamination: Boolean(raw.electron_contaminaton),
      energy: raw.energy ?? null,
      satellite: raw.satellite ?? null,
      xrayClass: classifyXrayFlux(flux),
    },
    unit: "W/m2",
    confidence: null,
    metadata: {
      provider: "NOAA SWPC",
      instrument: "GOES XRS",
      cadence_seconds: 60,
    },
    error: null,
  };
}

export function normalizeSolarRadiationArray(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeSolarRadiation)
    .filter((signal) => signal.error === null)
    .filter((signal) => signal.value.energy === "0.1-0.8nm")
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function classifyXrayFlux(flux) {
  if (flux >= 1e-4) return "X";
  if (flux >= 1e-5) return "M";
  if (flux >= 1e-6) return "C";
  if (flux >= 1e-7) return "B";
  return "A";
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
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SOLAR_RADIATION,
    value: null,
    unit: "W/m2",
    confidence: null,
    metadata: {},
    error: message,
  };
}
