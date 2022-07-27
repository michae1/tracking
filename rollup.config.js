
// import babel from "@rollup/plugin-babel";
// import babelrc from "babelrc-rollup";
import replace from "@rollup/plugin-replace";
import clientConfig from "./config/index";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';
import analyze from 'rollup-plugin-analyzer'
import fs from 'fs';
let pkg = require("./package.json");


fs.writeFileSync('src/globalLoad.js','var js=1;');

// let external = Object.keys(pkg.dependencies);
const ENV = process.env.NODE_ENV || "development";
let plugins = [
  typescript(),
  // babel(babelrc()),
  replace({
    preventAssignment: true,
    exclude: "node_modules/**",
    ENV: JSON.stringify(ENV),
    SERVER_ENDPOINT: JSON.stringify(clientConfig[ENV].SERVER_ENDPOINT),
    ROOT_NAME: JSON.stringify(clientConfig[ENV].ROOT_NAME),
  }),
  resolve({
    moduleDirectories: ['node_modules']
  }),
  analyze({
    summaryOnly: true,
    limit: 5
  })
];

if (ENV === "production") {
  plugins.push(terser());
}

export default {
  input: "src/index.ts",
  plugins: plugins,
  output: [
    {
      file: pkg.main,
      format: "iife",
    },
  ],
};
