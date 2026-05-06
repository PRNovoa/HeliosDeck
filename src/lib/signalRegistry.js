import { SIGNAL, SOURCE } from "@/lib/constants.js";
import { ROUTES } from "@/app/routes.js";

export const SIGNAL_STATUS = {
  LIVE: "LIVE",
  PENDING: "PENDING",
  MOCK: "MOCK",
};

export const SIGNAL_TOPIC = {
  ORBIT: "ORBIT",
  GEOMAGNETIC: "GEOMAGNETIC",
  HELIOSPHERIC: "HELIOSPHERIC",
  SOLAR: "SOLAR",
  PLASMA: "PLASMA",
  RADIATION: "RADIATION",
};

/**
 * SIGNAL_REGISTRY — Authoritative catalogue of every signal in Helios Deck.
 *
 * Fields:
 *   id             - SIGNAL constant (matches WIDGET_REGISTRY keys)
 *   label          - Human-readable name
 *   icon           - Emoji for visual identity
 *   topic          - SIGNAL_TOPIC classification
 *   provider       - Organisation that operates the instrument
 *   source         - SOURCE constant
 *   sourceLabel    - Display name of the data source
 *   sourceUrl      - Homepage/docs URL
 *   apiEndpoint    - REST endpoint (or description if POST/complex)
 *   status         - SIGNAL_STATUS
 *   implemented    - true when the full stack (hook + normalizer + widget) exists
 *   unit           - Physical unit of the primary value
 *   cadenceSeconds - Typical data refresh rate in seconds
 *   route          - ROUTES constant for the signal's page
 *   requiresKey    - true if an API key is needed
 *   corsStatus     - "free" | "proxy" | "verify" | "blocked"
 *   relatedSignals - Array of SIGNAL ids that are physically correlated
 *   pendingReason  - (PENDING only) Why it is not yet implemented
 *   nextStep       - (PENDING only) Concrete next engineering task
 */
export const SIGNAL_REGISTRY = [
  {
    id: SIGNAL.ISS_COORDINATES,
    label: "ISS Position",
    icon: "🛰",
    topic: SIGNAL_TOPIC.ORBIT,
    provider: "ESA / NASA / Roscosmos",
    source: SOURCE.ISS_API,
    sourceLabel: "wheretheiss.at",
    sourceUrl: "https://wheretheiss.at/w/developer",
    apiEndpoint: "https://api.wheretheiss.at/v1/satellites/25544",
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "°lat / °lon",
    cadenceSeconds: 5,
    route: ROUTES.ISS,
    requiresKey: false,
    corsStatus: "free",
    relatedSignals: [],
    pendingReason: null,
    nextStep: null,
  },
  {
    id: SIGNAL.KP_INDEX,
    label: "Kp Index",
    icon: "🌐",
    topic: SIGNAL_TOPIC.GEOMAGNETIC,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint:
      "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "Kp (0 – 9)",
    cadenceSeconds: 180,
    route: ROUTES.KP_INDEX,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.SOLAR_FLARE_EVENTS, SIGNAL.AURORAL_OVAL_PROBABILITY],
    pendingReason: null,
    nextStep: null,
  },
  {
    id: SIGNAL.SOLAR_FLARE_EVENTS,
    label: "Solar Flares",
    icon: "☀",
    topic: SIGNAL_TOPIC.SOLAR,
    provider: "NASA CCMC",
    source: SOURCE.NASA_DONKI,
    sourceLabel: "NASA DONKI",
    sourceUrl: "https://kauai.ccmc.gsfc.nasa.gov/DONKI",
    apiEndpoint: "https://api.nasa.gov/DONKI/FLR",
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "flare class (A–X)",
    cadenceSeconds: 1800,
    route: ROUTES.SOLAR_FLARES,
    requiresKey: true,
    corsStatus: "proxy",
    relatedSignals: [SIGNAL.KP_INDEX, SIGNAL.CORONAL_MASS_EJECTIONS],
    pendingReason: null,
    nextStep: null,
  },
  {
    id: SIGNAL.CORONAL_MASS_EJECTIONS,
    label: "CME Events",
    icon: "💥",
    topic: SIGNAL_TOPIC.HELIOSPHERIC,
    provider: "NASA CCMC",
    source: SOURCE.NASA_DONKI,
    sourceLabel: "NASA DONKI",
    sourceUrl: "https://kauai.ccmc.gsfc.nasa.gov/DONKI",
    apiEndpoint: "https://api.nasa.gov/DONKI/CME",
    status: SIGNAL_STATUS.PENDING,
    implemented: false,
    unit: "km/s (CME speed)",
    cadenceSeconds: 3600,
    route: ROUTES.CME,
    requiresKey: true,
    corsStatus: "proxy",
    relatedSignals: [
      SIGNAL.KP_INDEX,
      SIGNAL.SOLAR_FLARE_EVENTS,
      SIGNAL.AURORAL_OVAL_PROBABILITY,
    ],
    pendingReason:
      "The /DONKI/CME endpoint shares the NASA API key with solar flares. " +
      "CME analysis time fields are more complex (multiple instruments, " +
      "speed estimates per model). Normalizer design is non-trivial.",
    nextStep:
      "Create normalizeCME.js, fetchCME client call, useCME hook and CMEWidget component.",
  },
  {
    id: SIGNAL.SOLAR_WIND_SPEED,
    label: "Solar Wind Speed",
    icon: "〰",
    topic: SIGNAL_TOPIC.PLASMA,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint:
      "https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json",
    status: SIGNAL_STATUS.PENDING,
    implemented: false,
    unit: "km/s",
    cadenceSeconds: 60,
    route: ROUTES.SOLAR_WIND,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.KP_INDEX, SIGNAL.AURORAL_OVAL_PROBABILITY],
    pendingReason:
      "NOAA SWPC CORS behaviour differs between environments. " +
      "The Vite proxy handles dev but production CORS must be verified.",
    nextStep:
      "Verify NOAA SWPC CORS in Vercel production, then create normalizeSolarWind.js and SolarWindWidget.",
  },
  {
    id: SIGNAL.SOLAR_WIND_DENSITY,
    label: "Solar Wind Density",
    icon: "〰",
    topic: SIGNAL_TOPIC.PLASMA,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint:
      "https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json",
    status: SIGNAL_STATUS.PENDING,
    implemented: false,
    unit: "p/cm³",
    cadenceSeconds: 60,
    route: ROUTES.SOLAR_WIND,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.KP_INDEX],
    pendingReason:
      "Same endpoint and CORS blocker as Solar Wind Speed. " +
      "Density is a separate column in the same NOAA plasma file.",
    nextStep:
      "Implement Solar Wind Speed first. Density is a secondary field in the same normalizer.",
  },
  {
    id: SIGNAL.AURORAL_OVAL_PROBABILITY,
    label: "Aurora Oval",
    icon: "🌌",
    topic: SIGNAL_TOPIC.GEOMAGNETIC,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint:
      "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json",
    status: SIGNAL_STATUS.PENDING,
    implemented: false,
    unit: "% probability",
    cadenceSeconds: 300,
    route: ROUTES.AURORA,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.KP_INDEX, SIGNAL.SOLAR_WIND_SPEED],
    pendingReason:
      "Ovation aurora JSON is a large geospatial dataset (lat/lon grid). " +
      "Rendering auroral oval probability requires a map projection component not yet implemented.",
    nextStep:
      "Evaluate a lightweight canvas/SVG world map approach. Create normalizeAurora.js.",
  },
  {
    id: SIGNAL.SOLAR_RADIATION,
    label: "Solar Radiation",
    icon: "⚡",
    topic: SIGNAL_TOPIC.RADIATION,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint:
      "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json",
    status: SIGNAL_STATUS.PENDING,
    implemented: false,
    unit: "W/m²",
    cadenceSeconds: 60,
    route: ROUTES.SOLAR_RADIATION,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [],
    pendingReason:
      "GOES X-ray flux data requires parsing time-series JSON with high-frequency samples. " +
      "A Recharts line chart is the appropriate visualisation.",
    nextStep:
      "Create normalizeRadiation.js and a RadiationChart using Recharts LineChart.",
  },
];

/**
 * Look up a single registry entry by SIGNAL id.
 * Returns undefined if not found.
 * @param {string} signalId - SIGNAL constant
 * @returns {object|undefined}
 */
export function getSignalMeta(signalId) {
  return SIGNAL_REGISTRY.find((s) => s.id === signalId);
}
