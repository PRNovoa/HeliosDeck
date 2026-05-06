import { useQuery } from "@tanstack/react-query";
import { fetchAurora } from "@/services/api/otherClients.js";
import { normalizeAurora } from "@/services/normalizers/normalizeAurora.js";
import { QUERY_KEYS } from "@/lib/constants.js";

export function useAurora() {
  return useQuery({
    queryKey: QUERY_KEYS.aurora(),
    queryFn: async () => {
      const raw = await fetchAurora();
      return normalizeAurora(raw);
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}
