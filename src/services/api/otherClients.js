/**
 * API clients for public heliophysical and geophysical feeds.
 * -------------------------------------------------------
 * These functions only handle HTTP. Normalization happens in
 * src/services/normalizers.
 *
 * NASA DONKI: solar flares and CMEs, optional VITE_NASA_API_KEY.
 * NOAA SWPC: Kp, alerts, solar wind, aurora, X-ray flux, F10.7 flux.
 */

const NASA_BASE = import.meta.env.DEV ? "/api/nasa" : "https://api.nasa.gov";
const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? "DEMO_KEY";

const NOAA_BASE = import.meta.env.DEV
  ? "/api/noaa"
  : "https://services.swpc.noaa.gov";

/**
 * Fetch solar flare events.
 * @param {{ startDate: string, endDate: string }} params - YYYY-MM-DD
 * @returns {Promise<object[]>}
 */
export async function fetchSolarFlares({ startDate, endDate } = {}) {
  const params = new URLSearchParams({
    api_key: NASA_KEY,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });
  const res = await fetch(`${NASA_BASE}/DONKI/FLR?${params}`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NASA FLR error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch coronal mass ejection events.
 * @param {{ startDate: string, endDate: string }} params - YYYY-MM-DD
 * @returns {Promise<object[]>}
 */
export async function fetchCME({ startDate, endDate } = {}) {
  const params = new URLSearchParams({
    api_key: NASA_KEY,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });
  const res = await fetch(`${NASA_BASE}/DONKI/CME?${params}`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NASA CME error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch NOAA solar wind plasma 1-minute samples for the last day.
 * @returns {Promise<Array[]>}
 */
export async function fetchSolarWind() {
  const res = await fetch(
    `${NOAA_BASE}/products/solar-wind/plasma-1-day.json`,
  );
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NOAA solar wind error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch latest NOAA SWPC watches, warnings and alerts.
 * @returns {Promise<object[]>}
 */
export async function fetchSpaceWeatherAlerts() {
  const res = await fetch(`${NOAA_BASE}/products/alerts.json`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NOAA alerts error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch F10.7 cm solar radio flux observations.
 * @returns {Promise<object[]>}
 */
export async function fetchSolarRadioFlux() {
  const res = await fetch(`${NOAA_BASE}/json/f107_cm_flux.json`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NOAA F10.7 flux error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch latest NOAA Ovation aurora probability grid.
 * @returns {Promise<object>}
 */
export async function fetchAurora() {
  const res = await fetch(`${NOAA_BASE}/json/ovation_aurora_latest.json`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NOAA aurora error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch GOES primary X-ray flux samples for the last day.
 * @returns {Promise<object[]>}
 */
export async function fetchSolarRadiation() {
  const res = await fetch(`${NOAA_BASE}/json/goes/primary/xrays-1-day.json`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NOAA radiation error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch latest NOAA planetary Kp index values.
 * @returns {Promise<object[]>}
 */
export async function fetchKpIndex() {
  const res = await fetch(`${NOAA_BASE}/products/noaa-planetary-k-index.json`);
  if (!res.ok) {
    const message = await readProviderError(res);
    throw new Error(message || `NOAA Kp error: ${res.status}`);
  }
  return res.json();
}

async function readProviderError(res) {
  try {
    const body = await res.json();
    const providerMessage = body?.error?.message ?? body?.msg ?? body?.message;
    const providerCode = body?.error?.code;
    return providerCode
      ? `${providerCode}: ${providerMessage}`
      : providerMessage;
  } catch {
    try {
      const text = await res.text();
      return text ? `${res.status}: ${text.slice(0, 160)}` : null;
    } catch {
      return null;
    }
  }
}
