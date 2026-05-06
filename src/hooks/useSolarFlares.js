import { useQuery } from "@tanstack/react-query";
import { fetchSolarFlares } from "@/services/api/otherClients.js";
import { normalizeSolarFlareArray } from "@/services/normalizers/normalizeSolarFlare.js";
import { QUERY_KEYS } from "@/lib/constants.js";

/**
 * useSolarFlares
 * -------------------------------------------------------
 * Fetches solar flare events from NASA DONKI for the last N days.
 * Returns an array of NormalizedSignal objects sorted by severity.
 *
 * CORS STATUS: Requires VITE_NASA_API_KEY env variable.
 * Uses Vite proxy (/api/nasa) in dev, direct in prod.
 * If CORS or key issues arise, enable mock via VITE_USE_MOCKS=true.
 *
 * @param {number} days — how many days back to query (default 7)
 *
 * Usage:
 *   const { data, isLoading, isError } = useSolarFlares(7)
 *   data // NormalizedSignal[]
 *   data[0].value.classType   // "M2.1"
 *   data[0].value.severity    // 42.1
 */
export function useSolarFlares(days = 7) {
  return useQuery({
    queryKey: QUERY_KEYS.solarFlares(days),
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const toDateStr = (d) => d.toISOString().split("T")[0];

      const raw = await fetchSolarFlares({
        startDate: toDateStr(startDate),
        endDate: toDateStr(endDate),
      });

      return normalizeSolarFlareArray(raw);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes — flares are historical
    placeholderData: (prev) => prev,
  });
}
