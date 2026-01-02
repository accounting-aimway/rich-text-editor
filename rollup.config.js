import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const packageJson = require("./package.json");

export default {
  input: "src/index.js",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: [".js", ".jsx", ".json"],
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        ["@babel/preset-env", { modules: false }],
        ["@babel/preset-react", { runtime: "classic" }],
      ],
    }),
    commonjs(),
    terser(),
  ],
  external: (id) => {
    // Externalize all peer dependencies and their subpaths
    const externals = [
      "react",
      "react-dom",
      "prop-types",
      "@mui/",
      "@emotion/",
    ];
    return externals.some((ext) => id === ext || id.startsWith(ext));
  },
};
