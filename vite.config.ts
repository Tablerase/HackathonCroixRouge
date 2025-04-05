import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//! TODO: Update the target URL to the correct one
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://https://hackathon-ia-et-crise.fr/tousconcernes/rag-system:8090/api/app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
