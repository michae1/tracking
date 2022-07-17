import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import replace from 'rollup-plugin-replace';
import clientConfig from './config/index';
import { terser } from "rollup-plugin-terser";

let pkg = require('./package.json');


// let external = Object.keys(pkg.dependencies);
const ENV = process.env.NODE_ENV || 'development';
let plugins = [
    babel(babelrc()),
    replace({
        exclude: 'node_modules/**',
        ENV: JSON.stringify(ENV),
        SERVER_ENDPOINT: JSON.stringify(clientConfig[ENV].SERVER_ENDPOINT),
    })
];
console.log(ENV)
if (ENV === 'production') {
    plugins.push(terser());
}

export default {
  input: 'src/tracker.js',
  plugins: plugins,
  output: [
    {
        file: pkg.main,
        format: 'iife'
    }
  ]
};