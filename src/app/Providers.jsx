import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient.js";
import { DashboardProvider } from "@/context/DashboardContext.jsx";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";

/**
 * Wraps the entire app with all global providers.
 * Add new providers here — do NOT scatter them across pages.
 */
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DashboardProviderScope>{children}</DashboardProviderScope>
      </AuthProvider>
      {/* DevTools are tree-shaken out in production builds */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}

function DashboardProviderScope({ children }) {
  const { user } = useAuth();

  return (
    <DashboardProvider key={user?.id ?? "guest"}>{children}</DashboardProvider>
  );
}
