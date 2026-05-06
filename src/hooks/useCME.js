import { useQuery } from "@tanstack/react-query";
import { fetchCME } from "@/services/api/otherClients.js";
import { normalizeCMEArray } from "@/services/normalizers/normalizeCME.js";
import { QUERY_KEYS } from "@/lib/constants.js";

export function useCME(days = 7) {
  return useQuery({
    queryKey: QUERY_KEYS.cme(days),
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const toDateStr = (date) => date.toISOString().split("T")[0];
      const raw = await fetchCME({
        startDate: toDateStr(startDate),
        endDate: toDateStr(endDate),
      });
      return normalizeCMEArray(raw);
    },
    staleTime: 1000 * 60 * 60,
    placeholderData: (previousData) => previousData,
  });
}
