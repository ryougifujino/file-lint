#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require */

const { resolve } = require('path')
const fs = require('fs')
const ts = require('typescript')
const { lintNames } = require('../dist/index')

const ERROR_TAG = 'ok-file-lint'
const RE_FROM_STATEMENT = /from\s+(["'])[^"']+\1/
const TS_CONFIG_NAME = '.okfilelintrc.ts'
const JS_CONFIG_NAME = '.okfilelintrc.js'
const cwd = process.cwd()

function readConfig() {
  const tsConfigPath = resolve(cwd, TS_CONFIG_NAME)
  if (fs.existsSync(tsConfigPath)) {
    const tsConfigSource = fs.readFileSync(tsConfigPath, 'utf8')
    const transpiled = ts.transpileModule(tsConfigSource.replace(RE_FROM_STATEMENT, 'from "."'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    })
    const jsConfigPath = resolve(__dirname, '../dist/', JS_CONFIG_NAME)
    fs.writeFileSync(jsConfigPath, transpiled.outputText)
    return require(jsConfigPath).default
  }
  return require(resolve(cwd, JS_CONFIG_NAME))
}

try {
  lintNames(cwd, readConfig())
    .then((ok) => (ok ? 0 : process.exit(1)))
    .catch((e) => console.error(ERROR_TAG, e))
} catch (e) {
  console.error(ERROR_TAG, e)
  process.exit(1)
}
