import { useQuery } from "@tanstack/react-query";
import { fetchSolarWind } from "@/services/api/otherClients.js";
import { normalizeSolarWindArray } from "@/services/normalizers/normalizeSolarWind.js";
import { QUERY_KEYS } from "@/lib/constants.js";

export function useSolarWind() {
  return useQuery({
    queryKey: QUERY_KEYS.solarWind(),
    queryFn: async () => {
      const raw = await fetchSolarWind();
      return normalizeSolarWindArray(raw);
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}
