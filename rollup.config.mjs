import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.mjs", format: "es", sourcemap: true },
      { file: "dist/index.cjs", format: "cjs", sourcemap: true }
    ],
    external: ["react", "use-sync-external-store"],
    plugins: [resolve(), commonjs(), esbuild()]
  },
  {
    input: "src/index.ts",
    output: { file: "dist/index.d.ts", format: "es" },
    plugins: [dts()]
  }
];
