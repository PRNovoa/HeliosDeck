import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Providers } from "@/app/Providers.jsx";
import { router } from "@/app/router.jsx";

// Global styles — imported once here, not in individual components
import "@/styles/globals.css";

// react-grid-layout base styles
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
