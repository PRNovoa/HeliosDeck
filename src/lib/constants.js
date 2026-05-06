export const SIGNAL = {
  ISS_COORDINATES: "iss_coordinates",
  KP_INDEX: "kp_index",
  SOLAR_FLARE_EVENTS: "solar_flare_events",
  CORONAL_MASS_EJECTIONS: "coronal_mass_ejections",
  SOLAR_WIND_SPEED: "solar_wind_speed",
  SOLAR_WIND_DENSITY: "solar_wind_density",
  AURORAL_OVAL_PROBABILITY: "auroral_oval_probability",
  SOLAR_RADIATION: "solar_radiation",
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

export const DASHBOARD_CONFIG_VERSION = 4;
export const DASHBOARD_STORAGE_KEY = "helios-deck:dashboard-config";

export const WIDGET_REGISTRY = {
  [SIGNAL.ISS_COORDINATES]: {
    id: SIGNAL.ISS_COORDINATES,
    label: "ISS Position",
    description: "International Space Station live coordinates",
    defaultEnabled: true,
    defaultOrder: 0,
    defaultLayouts: {
      lg: { x: 0, y: 0, w: 4, h: 5 },
      md: { x: 0, y: 0, w: 5, h: 5 },
      sm: { x: 0, y: 5, w: 6, h: 5 },
      xs: { x: 0, y: 5, w: 4, h: 5 },
      xxs: { x: 0, y: 0, w: 1, h: 5 },
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
      lg: { x: 4, y: 0, w: 4, h: 5 },
      md: { x: 5, y: 0, w: 5, h: 5 },
      sm: { x: 0, y: 0, w: 3, h: 5 },
      xs: { x: 0, y: 0, w: 2, h: 5 },
      xxs: { x: 0, y: 5, w: 1, h: 5 },
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
      lg: { x: 8, y: 0, w: 4, h: 5 },
      md: { x: 0, y: 5, w: 10, h: 5 },
      sm: { x: 3, y: 0, w: 3, h: 5 },
      xs: { x: 2, y: 0, w: 2, h: 5 },
      xxs: { x: 0, y: 10, w: 1, h: 5 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.CORONAL_MASS_EJECTIONS]: {
    id: SIGNAL.CORONAL_MASS_EJECTIONS,
    label: "CME Events",
    description: "Coronal mass ejections from NASA DONKI",
    defaultEnabled: false,
    defaultOrder: 3,
    defaultLayouts: {
      lg: { x: 0, y: 5, w: 4, h: 5 },
      md: { x: 0, y: 10, w: 5, h: 5 },
      sm: { x: 0, y: 10, w: 3, h: 5 },
      xs: { x: 0, y: 10, w: 2, h: 5 },
      xxs: { x: 0, y: 15, w: 1, h: 5 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_WIND_SPEED]: {
    id: SIGNAL.SOLAR_WIND_SPEED,
    label: "Solar Wind Speed",
    description: "Real-time solar wind speed from DSCOVR/ACE",
    defaultEnabled: false,
    defaultOrder: 4,
    defaultLayouts: {
      lg: { x: 4, y: 5, w: 4, h: 5 },
      md: { x: 5, y: 10, w: 5, h: 5 },
      sm: { x: 3, y: 10, w: 3, h: 5 },
      xs: { x: 2, y: 10, w: 2, h: 5 },
      xxs: { x: 0, y: 20, w: 1, h: 5 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_WIND_DENSITY]: {
    id: SIGNAL.SOLAR_WIND_DENSITY,
    label: "Solar Wind Density",
    description: "Proton density of the solar wind",
    defaultEnabled: false,
    defaultOrder: 5,
    defaultLayouts: {
      lg: { x: 8, y: 5, w: 4, h: 5 },
      md: { x: 0, y: 15, w: 5, h: 5 },
      sm: { x: 0, y: 15, w: 3, h: 5 },
      xs: { x: 0, y: 15, w: 2, h: 5 },
      xxs: { x: 0, y: 25, w: 1, h: 5 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.AURORAL_OVAL_PROBABILITY]: {
    id: SIGNAL.AURORAL_OVAL_PROBABILITY,
    label: "Aurora Probability",
    description: "Auroral oval probability from NOAA SWPC",
    defaultEnabled: false,
    defaultOrder: 6,
    defaultLayouts: {
      lg: { x: 0, y: 10, w: 6, h: 5 },
      md: { x: 5, y: 15, w: 5, h: 5 },
      sm: { x: 3, y: 15, w: 3, h: 5 },
      xs: { x: 2, y: 15, w: 2, h: 5 },
      xxs: { x: 0, y: 30, w: 1, h: 5 },
    },
    minW: 2,
    minH: 3,
  },
  [SIGNAL.SOLAR_RADIATION]: {
    id: SIGNAL.SOLAR_RADIATION,
    label: "Solar Radiation",
    description: "Solar radiation flux data",
    defaultEnabled: false,
    defaultOrder: 7,
    defaultLayouts: {
      lg: { x: 6, y: 10, w: 6, h: 5 },
      md: { x: 0, y: 20, w: 10, h: 5 },
      sm: { x: 0, y: 20, w: 6, h: 5 },
      xs: { x: 0, y: 20, w: 4, h: 5 },
      xxs: { x: 0, y: 35, w: 1, h: 5 },
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
};
