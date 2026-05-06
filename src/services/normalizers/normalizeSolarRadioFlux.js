import { SOURCE, SIGNAL } from "@/lib/constants.js";

export function normalizeSolarRadioFlux(raw) {
  if (!raw || typeof raw !== "object") {
    return makeError("Invalid solar radio flux payload");
  }

  const timestamp = parseTimestamp(raw.time_tag ?? raw.timeTag ?? raw.observation_time);
  const observedFlux = toNullableNumber(raw.observed_flux ?? raw.observedFlux);
  const adjustedFlux = toNullableNumber(raw.adjusted_flux ?? raw.adjustedFlux);
  const flux = toNullableNumber(raw.flux ?? raw.flux_sfu ?? observedFlux ?? adjustedFlux);

  if (!timestamp) return makeError("Invalid solar radio flux timestamp");
  if (flux === null && observedFlux === null && adjustedFlux === null) {
    return makeError("Missing solar radio flux value");
  }

  const primaryFlux = flux ?? adjustedFlux ?? observedFlux;

  return {
    timestamp,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SOLAR_RADIO_FLUX,
    value: {
      flux_sfu: primaryFlux,
      observed_flux_sfu: observedFlux ?? primaryFlux,
      adjusted_flux_sfu: adjustedFlux,
      activityLevel: classifyFlux(primaryFlux),
    },
    unit: "sfu",
    confidence: null,
    metadata: {
      provider: "NOAA SWPC",
      wavelength: "10.7 cm",
      frequency_mhz: toNullableNumber(raw.frequency),
      reporting_schedule: raw.reporting_schedule ?? null,
      cadence_seconds: 86400,
    },
    error: null,
  };
}

export function normalizeSolarRadioFluxArray(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeSolarRadioFlux)
    .filter((signal) => signal.error === null)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function classifyFlux(flux) {
  if (flux === null) return "unknown";
  if (flux < 70) return "very_low";
  if (flux < 100) return "low";
  if (flux < 150) return "moderate";
  if (flux < 200) return "elevated";
  return "high";
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
    signal: SIGNAL.SOLAR_RADIO_FLUX,
    value: null,
    unit: "sfu",
    confidence: null,
    metadata: {},
    error: message,
  };
}
