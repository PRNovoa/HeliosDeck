import { createBrowserRouter } from "react-router-dom";
import { Shell } from "@/components/layout/Shell.jsx";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute.jsx";
import { ROUTES } from "@/app/routes.js";

// Pages
import { LoginPage } from "@/pages/LoginPage.jsx";
import { DashboardPage } from "@/pages/DashboardPage.jsx";
import { SignalsPage } from "@/pages/SignalsPage.jsx";
import { AnalysisPage } from "@/pages/AnalysisPage.jsx";
import { AlertsPage } from "@/pages/AlertsPage.jsx";
import { SourcesPage } from "@/pages/SourcesPage.jsx";
import { ISSPage } from "@/pages/ISSPage.jsx";
import { KpIndexPage } from "@/pages/KpIndexPage.jsx";
import { SolarFlaresPage } from "@/pages/SolarFlaresPage.jsx";
import { SolarWindPage } from "@/pages/SolarWindPage.jsx";
import { CMEPage } from "@/pages/CMEPage.jsx";
import { AuroraPage } from "@/pages/AuroraPage.jsx";
import { SolarRadiationPage } from "@/pages/SolarRadiationPage.jsx";
import { SettingsPage } from "@/pages/SettingsPage.jsx";
import { AboutPage } from "@/pages/AboutPage.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
  // ── Public ─────────────────────────────────────────────────────────────────
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },

  // ── Protected (requires login) ──────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Shell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.SIGNALS, element: <SignalsPage /> },
          { path: ROUTES.ANALYSIS, element: <AnalysisPage /> },
          { path: ROUTES.ALERTS, element: <AlertsPage /> },
          { path: ROUTES.SOURCES, element: <SourcesPage /> },
          { path: ROUTES.ISS, element: <ISSPage /> },
          { path: ROUTES.KP_INDEX, element: <KpIndexPage /> },
          { path: ROUTES.SOLAR_FLARES, element: <SolarFlaresPage /> },
          {
            path: ROUTES.CME,
            element: <CMEPage />,
          },
          {
            path: ROUTES.SOLAR_WIND,
            element: <SolarWindPage />,
          },
          {
            path: ROUTES.AURORA,
            element: <AuroraPage />,
          },
          {
            path: ROUTES.SOLAR_RADIATION,
            element: <SolarRadiationPage />,
          },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
          { path: ROUTES.ABOUT, element: <AboutPage /> },
        ],
      },
    ],
  },

  // ── Catch-all 404 ───────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);
