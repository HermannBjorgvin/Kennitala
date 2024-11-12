// rollup.config.js

import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  // ESM build
  {
    input: "src/index.ts",
    output: {
      dir: "dist/esm",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true,
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
    ],
  },
  // CJS build
  {
    input: "src/index.ts",
    output: {
      name: "kennitala",
      dir: "dist/umd",
      format: "umd",
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true,
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
    ],
  },
];
