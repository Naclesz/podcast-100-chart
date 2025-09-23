import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@styles": "/src/styles",
      components: "/src/components",
      hooks: "/src/hooks",
      services: "/src/services",
      context: "/src/context",
      pages: "/src/pages",
      router: "/src/router",
      config: "/src/config",
      types: "/src/types",
      utils: "/src/utils",
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
