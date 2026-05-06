/**
 * ISS API client
 * -------------------------------------------------------
 * Source:  https://wheretheiss.at/w/developer
 * No API key required. No CORS issues. ✅
 * Base URL: https://api.wheretheiss.at/v1
 *
 * Returns raw JSON — normalisation is done by normalizeISS.js.
 * This file ONLY handles HTTP concerns.
 */

const BASE_URL = "https://api.wheretheiss.at/v1";

/**
 * Fetch current ISS position.
 * NORAD ID 25544 = ISS (ZARYA)
 * @returns {Promise<object>} raw API payload
 */
export async function fetchISSPosition() {
  const response = await fetch(`${BASE_URL}/satellites/25544`);

  if (!response.ok) {
    throw new Error(`ISS API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch ISS position history for a list of Unix timestamps.
 * @param {number[]} timestamps — Unix seconds
 * @returns {Promise<object[]>} raw API payload array
 */
export async function fetchISSPositionHistory(timestamps) {
  const params = new URLSearchParams({ timestamps: timestamps.join(",") });
  const response = await fetch(
    `${BASE_URL}/satellites/25544/positions?${params}`,
  );

  if (!response.ok) {
    throw new Error(
      `ISS history API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
