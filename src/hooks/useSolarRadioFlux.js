import { useQuery } from "@tanstack/react-query";
import { fetchSolarRadioFlux } from "@/services/api/otherClients.js";
import { normalizeSolarRadioFluxArray } from "@/services/normalizers/normalizeSolarRadioFlux.js";
import { QUERY_KEYS } from "@/lib/constants.js";

export function useSolarRadioFlux() {
  return useQuery({
    queryKey: QUERY_KEYS.solarRadioFlux(),
    queryFn: async () => {
      const raw = await fetchSolarRadioFlux();
      return normalizeSolarRadioFluxArray(raw);
    },
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
    placeholderData: (previousData) => previousData,
  });
}
