import { defineConfig as defineVitestConfig } from "vitest/config";

export default defineVitestConfig({
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"], // Generate different report formats
      reportsDirectory: "./coverage", // Output directory
      include: ["src/**/*.{ts,tsx}"],
      all: true,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
      exclude: [
        "src/index.ts",
        "src/global.ts",
        "tests/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/node_modules/**"
      ]
    },
  },
});


