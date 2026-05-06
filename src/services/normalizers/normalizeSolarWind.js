import { SOURCE, SIGNAL } from "@/lib/constants.js";

export function normalizeSolarWindRow(row) {
  if (!Array.isArray(row) || row.length < 4) {
    return makeError("Invalid solar wind row");
  }

  const [timeTag, densityRaw, speedRaw, temperatureRaw] = row;
  const timestamp = parseTimestamp(timeTag);
  const speed = toNullableNumber(speedRaw);
  const density = toNullableNumber(densityRaw);
  const temperature = toNullableNumber(temperatureRaw);

  if (!timestamp) return makeError("Invalid solar wind timestamp");
  if (speed === null && density === null && temperature === null) {
    return makeError("Missing solar wind values");
  }

  return {
    timestamp,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SOLAR_WIND_SPEED,
    value: {
      speed_km_s: speed,
      density_p_cm3: density,
      temperature_k: temperature,
    },
    unit: "km/s",
    confidence: null,
    metadata: {
      provider: "NOAA SWPC",
      instrument: "DSCOVR/ACE plasma",
      cadence_seconds: 60,
    },
    error: null,
  };
}

export function normalizeSolarWindArray(raw) {
  if (!Array.isArray(raw)) return [];
  const rows = raw.filter((row) => Array.isArray(row));
  const dataRows = rows[0]?.[0] === "time_tag" ? rows.slice(1) : rows;
  return dataRows
    .map(normalizeSolarWindRow)
    .filter((signal) => signal.error === null)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export function getLatestSolarWind(raw) {
  const normalized = normalizeSolarWindArray(raw);
  return normalized.at(-1) ?? makeError("No solar wind samples available");
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseTimestamp(value) {
  if (!value) return null;
  const normalized = String(value).includes("T")
    ? String(value)
    : `${String(value).replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function makeError(message) {
  return {
    timestamp: null,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SOLAR_WIND_SPEED,
    value: null,
    unit: "km/s",
    confidence: null,
    metadata: {},
    error: message,
  };
}
