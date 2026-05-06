import { useQuery } from "@tanstack/react-query";
import { fetchISSPosition } from "@/services/api/issClient.js";
import { normalizeISS } from "@/services/normalizers/normalizeISS.js";
import { QUERY_KEYS } from "@/lib/constants.js";

/**
 * useISSPosition
 * -------------------------------------------------------
 * Fetches live ISS coordinates every 5 seconds.
 * Returns a NormalizedSignal (see normalizeISS.js).
 *
 * Usage:
 *   const { data, isLoading, isError, error } = useISSPosition()
 *   data.value.latitude   // number
 *   data.value.longitude  // number
 *   data.value.altitude_km
 *   data.value.velocity_kmh
 *   data.timestamp        // ISO 8601 UTC
 *   data.error            // null or error string from normalizer
 */
export function useISSPosition() {
  return useQuery({
    queryKey: QUERY_KEYS.iss(),
    queryFn: async () => {
      const raw = await fetchISSPosition();
      return normalizeISS(raw);
    },
    // ISS moves fast — refresh every 5 seconds
    refetchInterval: 5_000,
    // Keep showing previous position while fetching the next one
    placeholderData: (previousData) => previousData,
    // Override the global staleTime for this fast-moving signal
    staleTime: 4_000,
  });
}
