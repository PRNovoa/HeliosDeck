/**
 * ISS API stub clients for other signals.
 * -------------------------------------------------------
 * NASA DONKI — Solar Flares, CMEs
 * Status: Requires API key. Possible CORS in production.
 * Use Vite proxy (/api/nasa) in dev. Use MOCK in prod until proxy/key confirmed.
 *
 * NOAA SWPC — Solar Wind, Aurora
 * Status: CORS unconfirmed. Verify before enabling.
 *
 * GFZ — Kp Index
 * Status: CORS unconfirmed. Verify before enabling.
 */

const NASA_BASE = import.meta.env.DEV
  ? "/api/nasa" // → Vite proxy → api.nasa.gov
  : "https://api.nasa.gov"; // Direct in production (may need CORS fix)

const NASA_KEY = import.meta.env.VITE_NASA_API_KEY ?? "DEMO_KEY";

// ── NASA DONKI ────────────────────────────────────────────────────────────────

/**
 * Fetch solar flare events.
 * @param {{ startDate: string, endDate: string }} params — YYYY-MM-DD
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
 * @param {{ startDate: string, endDate: string }} params
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

// ── NOAA SWPC ─────────────────────────────────────────────────────────────────
// TODO: Confirm CORS status before removing MOCK flag.

const NOAA_BASE = import.meta.env.DEV
  ? "/api/noaa"
  : "https://services.swpc.noaa.gov";

/**
 * Fetch solar wind 1-minute data (last 2 hours).
 * @returns {Promise<number[][]>}
 */
export async function fetchSolarWind() {
  // NOAA returns a JSON array, first element is headers
  const res = await fetch(
    `${NOAA_BASE}/products/solar-wind/plasma-1-day.json`,
  );
  if (!res.ok) throw new Error(`NOAA solar wind error: ${res.status}`);
  return res.json();
}

/**
 * Fetch latest NOAA SWPC watches, warnings and alerts.
 * @returns {Promise<object[]>}
 */
export async function fetchSpaceWeatherAlerts() {
  const res = await fetch(`${NOAA_BASE}/products/alerts.json`);
  if (!res.ok) throw new Error(`NOAA alerts error: ${res.status}`);
  return res.json();
}

/**
 * Fetch F10.7 cm solar radio flux observations.
 * @returns {Promise<object[]>}
 */
export async function fetchSolarRadioFlux() {
  const res = await fetch(`${NOAA_BASE}/json/f107_cm_flux.json`);
  if (!res.ok) throw new Error(`NOAA F10.7 flux error: ${res.status}`);
  return res.json();
}

/**
 * Fetch latest NOAA Ovation aurora probability grid.
 * @returns {Promise<object>}
 */
export async function fetchAurora() {
  const res = await fetch(`${NOAA_BASE}/json/ovation_aurora_latest.json`);
  if (!res.ok) throw new Error(`NOAA aurora error: ${res.status}`);
  return res.json();
}

/**
 * Fetch GOES X-ray flux samples for the last day.
 * @returns {Promise<object[]>}
 */
export async function fetchSolarRadiation() {
  const res = await fetch(`${NOAA_BASE}/json/goes/primary/xrays-1-day.json`);
  if (!res.ok) throw new Error(`NOAA radiation error: ${res.status}`);
  return res.json();
}

/**
 * Fetch latest Kp index values.
 * @returns {Promise<number[][]>}
 */
export async function fetchKpIndex() {
  const res = await fetch(`${NOAA_BASE}/products/noaa-planetary-k-index.json`);
  if (!res.ok) throw new Error(`NOAA Kp error: ${res.status}`);
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
    return null;
  }
}
