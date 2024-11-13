import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
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
];
