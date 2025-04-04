import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "autoUpdate",
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
    globPatterns: ["**/*.{svg,ico}"],
    navigateFallback: "/index.html",
  },
  devOptions: {
    enabled: true,
  },
  includeAssets: ["favicon.svg", "**/*"],
  navigateFallback: "/index.html",
  manifest: {
    name: "Cloudzyy",
    short_name: "Cloudzyy",
    description: "Cloudzyy - A Github Repo Container",
    icons: [
      {
        src: "favicon.svg",
        sizes: "any",
        type: "image/png",
      },
    ],
    theme_color: "#111827",
    background_color: "#111827",
    display: "standalone",
    scope: "/",
    start_url: "/",
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  server: {
    port: 4011,
  },
});
