/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import convict from 'convict';

// convict lets us get config from env, json, hardcoded defaults
let config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT'
  },
  mainServerUrl: {
    doc: 'The public url of the server.',
    format: String,
    default: 'localhost',
    env: 'MAIN_SERVER_URL'
  },
  baseUrl: {
    doc: 'The base URL of the server (pre v1/v2).',
    format: String,
    default: '/',
    env: 'BASE_URL'
  },
  urlsUrl: {
    doc: 'The URL where the server link is kept for v1.',
    format: String,
    default: '/urls',
    env: 'URLS_URL'
  },
  numBuckets: {
    doc: 'The number of S3 buckets.',
    format: Number,
    default: 100,
    env: 'NUM_BUCKETS'
  },
  experimentsFile: {
    doc: 'The file path of the experiments JSON.',
    format: String,
    default: __dirname + '/experiments.json',
    env: 'EXPERIMENTS_FILE'
  },
  configFile: {
    doc: 'The file path of the JSON config file.',
    format: String,
    default: '',
    env: 'CONFIG_FILE'
  },
  debug: {
    doc: 'Debug mode for the app.',
    format: Boolean,
    default: false,
    env: 'DEBUG_MODE'
  }
});

// Load environment dependent configuration
// unused
let env = config.get('env');

if (config.get('configFile') !== '') {
  // Load from json file
  config.loadFile(config.get('configFile'));
}

// Perform validation
config.validate({
  strict: true
});

module.exports = config;
