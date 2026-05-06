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
    provider: "International Space Station program",
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
    cadenceSeconds: 60,
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
    id: SIGNAL.SPACE_WEATHER_ALERTS,
    label: "Space Weather Alerts",
    icon: "⚠",
    topic: SIGNAL_TOPIC.GEOMAGNETIC,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint: "https://services.swpc.noaa.gov/products/alerts.json",
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "alert",
    cadenceSeconds: 300,
    route: ROUTES.SIGNALS,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [
      SIGNAL.KP_INDEX,
      SIGNAL.SOLAR_WIND_SPEED,
      SIGNAL.SOLAR_FLARE_EVENTS,
      SIGNAL.AURORAL_OVAL_PROBABILITY,
    ],
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
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
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
    pendingReason: null,
    nextStep: null,
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
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "km/s",
    cadenceSeconds: 60,
    route: ROUTES.SOLAR_WIND,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.KP_INDEX, SIGNAL.AURORAL_OVAL_PROBABILITY],
    pendingReason: null,
    nextStep: null,
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
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "p/cm³",
    cadenceSeconds: 60,
    route: ROUTES.SOLAR_WIND,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.KP_INDEX],
    pendingReason: null,
    nextStep: null,
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
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "% probability",
    cadenceSeconds: 300,
    route: ROUTES.AURORA,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.KP_INDEX, SIGNAL.SOLAR_WIND_SPEED],
    pendingReason: null,
    nextStep: null,
  },
  {
    id: SIGNAL.SOLAR_RADIATION,
    label: "GOES X-Ray Flux",
    icon: "⚡",
    topic: SIGNAL_TOPIC.RADIATION,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint:
      "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json",
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "W/m2",
    cadenceSeconds: 60,
    route: ROUTES.SOLAR_RADIATION,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [],
    pendingReason: null,
    nextStep: null,
  },
  {
    id: SIGNAL.SOLAR_RADIO_FLUX,
    label: "Solar Radio Flux",
    icon: "📡",
    topic: SIGNAL_TOPIC.SOLAR,
    provider: "NOAA Space Weather Prediction Center",
    source: SOURCE.NOAA_SWPC,
    sourceLabel: "NOAA SWPC",
    sourceUrl: "https://www.swpc.noaa.gov",
    apiEndpoint: "https://services.swpc.noaa.gov/json/f107_cm_flux.json",
    status: SIGNAL_STATUS.LIVE,
    implemented: true,
    unit: "sfu",
    cadenceSeconds: 86400,
    route: ROUTES.SIGNALS,
    requiresKey: false,
    corsStatus: "verify",
    relatedSignals: [SIGNAL.SOLAR_FLARE_EVENTS, SIGNAL.SOLAR_RADIATION],
    pendingReason: null,
    nextStep: null,
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
