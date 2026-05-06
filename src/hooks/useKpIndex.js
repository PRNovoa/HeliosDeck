import { useQuery } from "@tanstack/react-query";
import { fetchKpIndex } from "@/services/api/otherClients.js";
import { normalizeKpIndex } from "@/services/normalizers/normalizeKpIndex.js";
import { QUERY_KEYS } from "@/lib/constants.js";

/**
 * useKpIndex
 * -------------------------------------------------------
 * Fetches the latest NOAA planetary Kp index value.
 * Refreshes every 3 minutes (NOAA updates ~every 3h but we stay fresh).
 *
 * CORS STATUS: Unconfirmed for production. Uses Vite proxy in dev.
 * If CORS fails, replace fetchKpIndex with mock fixture.
 *
 * Usage:
 *   const { data, isLoading, isError } = useKpIndex()
 *   data.value.kp     // number e.g. 4.3
 *   data.value.level  // e.g. "active"
 */
export function useKpIndex() {
  return useQuery({
    queryKey: QUERY_KEYS.kp(),
    queryFn: async () => {
      const rows = await fetchKpIndex();
      const dataRows = Array.isArray(rows)
        ? rows.filter((row) => {
            if (Array.isArray(row)) return row[0] !== "time_tag";
            return row && typeof row === "object" && row.time_tag;
          })
        : [];
      const latest = dataRows[dataRows.length - 1];
      return normalizeKpIndex(latest);
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  });
}
