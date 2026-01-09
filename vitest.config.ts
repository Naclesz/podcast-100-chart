import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/tests/**", // Exclude Playwright E2E tests
    ],
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
      services: "/src/services",
      config: "/src/config",
      types: "/src/types",
      utils: "/src/utils",
      domain: "/src/domain",
      infrastructure: "/src/infrastructure",
      application: "/src/application",
      presentation: "/src/presentation",
      shared: "/src/shared",
    },
  },
});
