'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SITE_BASE: '"http://localhost:8091"',
  API_ROOT: '"http://cloud.local.thaiok.menu"',
  // API_ROOT: '"https://cloud.thaiok.menu"',
  // SITE_BASE: '"https://h5.thaiok.menu"',
  APP_VERSION: '"v1"',
  ACCOUNT_ROOT: '"//account.local.thaiok.menu"'
})
