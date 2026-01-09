import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@styles": "/src/styles",
      domain: "/src/domain",
      infrastructure: "/src/infrastructure",
      application: "/src/application",
      presentation: "/src/presentation",
      shared: "/src/shared",
    },
  },
  server: {
    proxy: {
      "/api/itunes": {
        target: "https://itunes.apple.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/itunes/, ""),
        secure: true,
      },
    },
  },
});
