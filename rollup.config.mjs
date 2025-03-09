import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.mjs", format: "es", sourcemap: false },
      { file: "dist/index.cjs", format: "cjs", sourcemap: false },
    ],
    external: ["react", "use-sync-external-store"],
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        minify: true, // Minifies the code
        target: "esnext",
      }),
      terser(), // Further minifies with tree shaking
    ],
  },
  {
    input: "src/index.ts",
    output: { file: "dist/index.d.ts", format: "es" },
    plugins: [dts()],
  },
];
