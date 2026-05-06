import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    alias: {
      "@/": path.resolve(__dirname, "./src") + "/",
    },
  },
  server: {
    // Proxy for APIs that block CORS in development
    proxy: {
      "/api/nasa": {
        target: "https://api.nasa.gov",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/nasa/, ""),
      },
      "/api/noaa": {
        target: "https://services.swpc.noaa.gov",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/noaa/, ""),
      },
    },
  },
});
