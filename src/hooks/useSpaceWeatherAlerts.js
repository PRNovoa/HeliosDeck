import { useQuery } from "@tanstack/react-query";
import { fetchSpaceWeatherAlerts } from "@/services/api/otherClients.js";
import { normalizeSpaceWeatherAlertArray } from "@/services/normalizers/normalizeSpaceWeatherAlert.js";
import { QUERY_KEYS } from "@/lib/constants.js";

export function useSpaceWeatherAlerts() {
  return useQuery({
    queryKey: QUERY_KEYS.spaceWeatherAlerts(),
    queryFn: async () => {
      const raw = await fetchSpaceWeatherAlerts();
      return normalizeSpaceWeatherAlertArray(raw);
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}
