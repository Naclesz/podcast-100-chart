import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/main.tsx",
        "**/vite-env.d.ts",
      ],
    },
  },
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
});
