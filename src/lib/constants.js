export const SIGNAL = {
  ISS_COORDINATES: "iss_coordinates",
  KP_INDEX: "kp_index",
  SOLAR_FLARE_EVENTS: "solar_flare_events",
  CORONAL_MASS_EJECTIONS: "coronal_mass_ejections",
  SOLAR_WIND_SPEED: "solar_wind_speed",
  SOLAR_WIND_DENSITY: "solar_wind_density",
  AURORAL_OVAL_PROBABILITY: "auroral_oval_probability",
  SOLAR_RADIATION: "solar_radiation",
  SPACE_WEATHER_ALERTS: "space_weather_alerts",
  SOLAR_RADIO_FLUX: "solar_radio_flux",
};

export const SOURCE = {
  ISS_API: "ISS_API",
  NASA_DONKI: "NASA_DONKI",
  NASA_POWER: "NASA_POWER",
  NOAA_SWPC: "NOAA_SWPC",
  GFZ: "GFZ",
  MOCK: "MOCK",
  UNKNOWN: "UNKNOWN",
};

export const KP_LEVEL = {
  QUIET: "quiet",
  UNSETTLED: "unsettled",
  ACTIVE: "active",
  MINOR: "minor",
  MODERATE: "moderate",
  STRONG: "strong",
  SEVERE: "severe",
  EXTREME: "extreme",
};

export const FLARE_CLASS = ["A", "B", "C", "M", "X"];

export const DASHBOARD_LAYOUT_BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

export const DASHBOARD_LAYOUT_COLUMNS = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 1,
};

export const DASHBOARD_CONFIG_VERSION = 8;
export const DASHBOARD_STORAGE_KEY = "helios-deck:dashboard-config";

export const WIDGET_REGISTRY = {
  [SIGNAL.ISS_COORDINATES]: {
    id: SIGNAL.ISS_COORDINATES,
    label: "ISS Position",
    description: "International Space Station live coordinates",
    defaultEnabled: true,
    defaultOrder: 0,
    defaultLayouts: {
      lg: { x: 0, y: 0, w: 4, h: 4 },
      md: { x: 0, y: 0, w: 5, h: 4 },
      sm: { x: 0, y: 4, w: 6, h: 4 },
      xs: { x: 0, y: 4, w: 4, h: 4 },
      xxs: { x: 0, y: 0, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.KP_INDEX]: {
    id: SIGNAL.KP_INDEX,
    label: "Kp Index",
    description: "Global geomagnetic activity index",
    defaultEnabled: true,
    defaultOrder: 1,
    defaultLayouts: {
      lg: { x: 4, y: 0, w: 3, h: 4 },
      md: { x: 5, y: 0, w: 5, h: 4 },
      sm: { x: 0, y: 0, w: 3, h: 4 },
      xs: { x: 0, y: 0, w: 2, h: 4 },
      xxs: { x: 0, y: 4, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_FLARE_EVENTS]: {
    id: SIGNAL.SOLAR_FLARE_EVENTS,
    label: "Solar Flares",
    description: "Recent solar flare events from NASA DONKI",
    defaultEnabled: true,
    defaultOrder: 2,
    defaultLayouts: {
      lg: { x: 7, y: 0, w: 5, h: 4 },
      md: { x: 0, y: 4, w: 5, h: 4 },
      sm: { x: 3, y: 0, w: 3, h: 4 },
      xs: { x: 2, y: 0, w: 2, h: 4 },
      xxs: { x: 0, y: 8, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.CORONAL_MASS_EJECTIONS]: {
    id: SIGNAL.CORONAL_MASS_EJECTIONS,
    label: "CME Events",
    description: "Coronal mass ejections from NASA DONKI",
    defaultEnabled: true,
    defaultOrder: 4,
    defaultLayouts: {
      lg: { x: 0, y: 13, w: 12, h: 4 },
      md: { x: 5, y: 16, w: 5, h: 4 },
      sm: { x: 3, y: 12, w: 3, h: 4 },
      xs: { x: 2, y: 12, w: 2, h: 4 },
      xxs: { x: 0, y: 12, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SPACE_WEATHER_ALERTS]: {
    id: SIGNAL.SPACE_WEATHER_ALERTS,
    label: "Space Weather Alerts",
    description: "Latest watches, warnings and alerts from NOAA SWPC",
    defaultEnabled: true,
    defaultOrder: 3,
    defaultLayouts: {
      lg: { x: 0, y: 4, w: 5, h: 5 },
      md: { x: 0, y: 8, w: 5, h: 4 },
      sm: { x: 0, y: 8, w: 3, h: 4 },
      xs: { x: 0, y: 8, w: 2, h: 4 },
      xxs: { x: 0, y: 16, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_WIND_SPEED]: {
    id: SIGNAL.SOLAR_WIND_SPEED,
    label: "Solar Wind Speed",
    description: "Real-time solar wind speed from DSCOVR/ACE",
    defaultEnabled: true,
    defaultOrder: 5,
    defaultLayouts: {
      lg: { x: 5, y: 4, w: 4, h: 5 },
      md: { x: 5, y: 4, w: 5, h: 4 },
      sm: { x: 3, y: 8, w: 3, h: 4 },
      xs: { x: 2, y: 8, w: 2, h: 4 },
      xxs: { x: 0, y: 20, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_WIND_DENSITY]: {
    id: SIGNAL.SOLAR_WIND_DENSITY,
    label: "Solar Wind Density",
    description: "Proton density of the solar wind",
    defaultEnabled: true,
    defaultOrder: 6,
    defaultLayouts: {
      lg: { x: 9, y: 4, w: 3, h: 5 },
      md: { x: 5, y: 8, w: 5, h: 4 },
      sm: { x: 0, y: 16, w: 3, h: 4 },
      xs: { x: 0, y: 16, w: 2, h: 4 },
      xxs: { x: 0, y: 24, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.AURORAL_OVAL_PROBABILITY]: {
    id: SIGNAL.AURORAL_OVAL_PROBABILITY,
    label: "Aurora Probability",
    description: "Auroral oval probability from NOAA SWPC",
    defaultEnabled: true,
    defaultOrder: 7,
    defaultLayouts: {
      lg: { x: 0, y: 9, w: 4, h: 4 },
      md: { x: 0, y: 12, w: 5, h: 4 },
      sm: { x: 3, y: 16, w: 3, h: 4 },
      xs: { x: 2, y: 16, w: 2, h: 4 },
      xxs: { x: 0, y: 28, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_RADIATION]: {
    id: SIGNAL.SOLAR_RADIATION,
    label: "GOES X-Ray Flux",
    description: "GOES primary X-ray flux samples from NOAA SWPC",
    defaultEnabled: true,
    defaultOrder: 9,
    defaultLayouts: {
      lg: { x: 4, y: 9, w: 5, h: 4 },
      md: { x: 0, y: 16, w: 5, h: 4 },
      sm: { x: 0, y: 20, w: 6, h: 4 },
      xs: { x: 0, y: 20, w: 4, h: 4 },
      xxs: { x: 0, y: 32, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_RADIO_FLUX]: {
    id: SIGNAL.SOLAR_RADIO_FLUX,
    label: "Solar Radio Flux",
    description: "F10.7 cm solar radio flux activity proxy from NOAA SWPC",
    defaultEnabled: true,
    defaultOrder: 8,
    defaultLayouts: {
      lg: { x: 9, y: 9, w: 3, h: 4 },
      md: { x: 5, y: 12, w: 5, h: 4 },
      sm: { x: 0, y: 12, w: 3, h: 4 },
      xs: { x: 0, y: 12, w: 2, h: 4 },
      xxs: { x: 0, y: 36, w: 1, h: 4 },
    },
    minW: 2,
    minH: 3,
  },
};

export const QUERY_KEYS = {
  iss: () => [SIGNAL.ISS_COORDINATES],
  kp: () => [SIGNAL.KP_INDEX],
  solarFlares: (days = 7) => [SIGNAL.SOLAR_FLARE_EVENTS, { days }],
  cme: (days = 7) => [SIGNAL.CORONAL_MASS_EJECTIONS, { days }],
  solarWind: () => [SIGNAL.SOLAR_WIND_SPEED],
  aurora: () => [SIGNAL.AURORAL_OVAL_PROBABILITY],
  radiation: () => [SIGNAL.SOLAR_RADIATION],
  spaceWeatherAlerts: () => [SIGNAL.SPACE_WEATHER_ALERTS],
  solarRadioFlux: () => [SIGNAL.SOLAR_RADIO_FLUX],
};
