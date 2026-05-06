import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes by default
      staleTime: 1000 * 60 * 5,
      // Keep cached data for 10 minutes after the component unmounts
      gcTime: 1000 * 60 * 10,
      // Retry failed requests twice before showing error
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      // Don't refetch when the user re-focuses the tab — data doesn't change that fast
      refetchOnWindowFocus: false,
    },
  },
});
