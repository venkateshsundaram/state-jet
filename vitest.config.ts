import { defineConfig as defineVitestConfig } from "vitest/config";

export default defineVitestConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"], // Generate different report formats
      reportsDirectory: "./coverage", // Output directory
      include: ["src/**/*.{ts,tsx}"],
      all: true,
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
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


