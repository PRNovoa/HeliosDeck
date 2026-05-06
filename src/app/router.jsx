import { createBrowserRouter } from "react-router-dom";
import { Shell } from "@/components/layout/Shell.jsx";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute.jsx";
import { ROUTES } from "@/app/routes.js";
import { SIGNAL } from "@/lib/constants.js";

// Pages
import { LoginPage } from "@/pages/LoginPage.jsx";
import { DashboardPage } from "@/pages/DashboardPage.jsx";
import { SignalsPage } from "@/pages/SignalsPage.jsx";
import { ISSPage } from "@/pages/ISSPage.jsx";
import { KpIndexPage } from "@/pages/KpIndexPage.jsx";
import { SolarFlaresPage } from "@/pages/SolarFlaresPage.jsx";
import { ComingSoonPage } from "@/pages/ComingSoonPage.jsx";
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
          { path: ROUTES.SIGNALS, element: <SignalsPage /> },
          { path: ROUTES.ISS, element: <ISSPage /> },
          { path: ROUTES.KP_INDEX, element: <KpIndexPage /> },
          { path: ROUTES.SOLAR_FLARES, element: <SolarFlaresPage /> },
          {
            path: ROUTES.CME,
            element: (
              <ComingSoonPage signalId={SIGNAL.CORONAL_MASS_EJECTIONS} />
            ),
          },
          {
            path: ROUTES.SOLAR_WIND,
            element: <ComingSoonPage signalId={SIGNAL.SOLAR_WIND_SPEED} />,
          },
          {
            path: ROUTES.AURORA,
            element: (
              <ComingSoonPage signalId={SIGNAL.AURORAL_OVAL_PROBABILITY} />
            ),
          },
          {
            path: ROUTES.SOLAR_RADIATION,
            element: <ComingSoonPage signalId={SIGNAL.SOLAR_RADIATION} />,
          },
          { path: ROUTES.ABOUT, element: <AboutPage /> },
        ],
      },
    ],
  },

  // ── Catch-all 404 ───────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);
