import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginRequire from "vite-plugin-require";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      hooks: "/src/hooks",
      common: "/src/common",
      assets: "/src/assets",
      mst: "/src/mst",
      components: "/src/components",
      router: "/src/router",
      services: "/src/services",
      api: "/src/services/api",
      config: "/src/config",
      screens: "/src/screens", // Corrected alias
    },
  },
  plugins: [react(), vitePluginRequire.default()],
  server: {
    port: 3001 // Change to your desired port
  }

});
