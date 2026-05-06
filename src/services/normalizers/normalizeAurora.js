import { SOURCE, SIGNAL } from "@/lib/constants.js";

export function normalizeAurora(raw) {
  if (!raw || typeof raw !== "object") {
    return makeError("Invalid aurora payload");
  }

  const timestamp = parseTimestamp(raw["Observation Time"]);
  const coordinates = Array.isArray(raw.coordinates) ? raw.coordinates : [];

  if (!timestamp) return makeError("Missing aurora observation time");
  if (coordinates.length === 0) return makeError("Missing aurora coordinates");

  const points = coordinates
    .filter((point) => Array.isArray(point) && point.length >= 3)
    .map(([longitude, latitude, probability]) => ({
      longitude: Number(longitude),
      latitude: Number(latitude),
      probability: Number(probability),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.longitude) &&
        Number.isFinite(point.latitude) &&
        Number.isFinite(point.probability),
    );

  if (points.length === 0) return makeError("No valid aurora probability points");

  const maxPoint = points.reduce((best, point) =>
    point.probability > best.probability ? point : best,
  );
  const activePoints = points.filter((point) => point.probability >= 10).length;
  const northernMax = maxProbabilityForHemisphere(points, 0, 90);
  const southernMax = maxProbabilityForHemisphere(points, -90, 0);

  return {
    timestamp,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.AURORAL_OVAL_PROBABILITY,
    value: {
      max_probability_pct: maxPoint.probability,
      max_latitude: maxPoint.latitude,
      max_longitude: maxPoint.longitude,
      active_point_count: activePoints,
      northern_max_pct: northernMax,
      southern_max_pct: southernMax,
      forecastTime: parseTimestamp(raw["Forecast Time"]),
      activityLevel: classifyProbability(maxPoint.probability),
      sample_points: points.filter((_, index) => index % 120 === 0).slice(0, 40),
    },
    unit: "% probability",
    confidence: null,
    metadata: {
      provider: "NOAA SWPC",
      model: "Ovation Aurora",
      cadence_seconds: 300,
      point_count: points.length,
    },
    error: null,
  };
}

function maxProbabilityForHemisphere(points, minLat, maxLat) {
  return points
    .filter((point) => point.latitude >= minLat && point.latitude <= maxLat)
    .reduce((max, point) => Math.max(max, point.probability), 0);
}

function classifyProbability(probability) {
  if (probability >= 60) return "high";
  if (probability >= 30) return "elevated";
  if (probability >= 10) return "visible";
  return "quiet";
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
    signal: SIGNAL.AURORAL_OVAL_PROBABILITY,
    value: null,
    unit: "% probability",
    confidence: null,
    metadata: {},
    error: message,
  };
}
