
// import babel from "@rollup/plugin-babel";
// import babelrc from "babelrc-rollup";
import replace from "@rollup/plugin-replace";
import clientConfig from "./config/index";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import analyze from 'rollup-plugin-analyzer';
import fs from 'fs';
import cjs from '@rollup/plugin-commonjs';
let pkg = require("./package.json");

let appModules = [];

if (fs.existsSync('modules.son')) {

} else {
  appModules = JSON.parse(fs.readFileSync('modules.default.json'));
}

let content = "// File is auto generated \n";

appModules.forEach(m => {
  if (fs.existsSync('src/' + m + '.ts')) {
    content += `import \"${m}\";\n`;
    // content += `${m.name}.init && ${m.name}.init();\n`;
  } else {
    console.error(`Ignoring module ${m}: file does not exist`);
  }
})

fs.writeFileSync('src/globalLoad.js',content);

const ENV = process.env.NODE_ENV || "development";
let plugins = [
  json(),
  cjs(),
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

export default [
{
  input: "src/index.ts",
  plugins: plugins,
  output: [
    {
      file: pkg.main,
      format: "iife",
    },
  ],
// },
// {
//   input: "src/ServiceWorker/worker.ts",
//   plugins: plugins,
//   output: [
//     {
//       dir: pkg.outputDir,
//       format: "es",
//     },
//   ],
}
];
