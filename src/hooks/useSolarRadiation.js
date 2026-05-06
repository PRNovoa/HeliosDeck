import { useQuery } from "@tanstack/react-query";
import { fetchSolarRadiation } from "@/services/api/otherClients.js";
import { normalizeSolarRadiationArray } from "@/services/normalizers/normalizeSolarRadiation.js";
import { QUERY_KEYS } from "@/lib/constants.js";

export function useSolarRadiation() {
  return useQuery({
    queryKey: QUERY_KEYS.radiation(),
    queryFn: async () => {
      const raw = await fetchSolarRadiation();
      return normalizeSolarRadiationArray(raw);
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}
