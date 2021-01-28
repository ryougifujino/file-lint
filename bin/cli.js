#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require */

const path = require('path')
const { lint } = require('../dist/index')

const cwd = process.cwd()

let config

try {
  config = require(path.resolve(cwd, '.okfilelintrc.js'))
} catch (e) {
  console.error('Can not find the config file - ".okfilelintrc.js".')
  process.exit(1)
}

lint(cwd, config)
  .then((ok) => (ok ? 0 : process.exit(1)))
  .catch(console.error)
