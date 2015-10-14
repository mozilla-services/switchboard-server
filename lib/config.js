import convict from 'convict'

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
  main_server_url: {
    doc: 'The public url of the server.',
    format: String,
    default: 'localhost',
    env: 'MAIN_SERVER_URL'
  },
  base_url: {
    doc: 'The base URL of the server (pre v1/v2).',
    format: String,
    default: '/',
    env: 'BASE_URL'
  },
  urls_url: {
    doc: 'The URL where the server link is kept for v1.',
    format: String,
    default: '/urls',
    env: 'URLS_URL'
  },
  num_buckets: {
    doc: 'The number of S3 buckets.',
    format: Number,
    default: 100,
    env: 'NUM_BUCKETS'
  },
  experiments_file: {
    doc: 'The file path of the experiments JSON.',
    format: String,
    default: __dirname + '/../config/experiments.json',
    env: 'EXPERIMENTS_FILE'
  },
  config_file: {
    doc: 'The file path of the JSON config file.',
    format: String,
    default: '',
    env: 'CONFIG_FILE'
  },
  access_log_file: {
    doc: 'The file path of the server access log.',
    format: String,
    default: __dirname + '/../access.log',
    env: 'ACCESS_LOG_FILE'
  }
});

  // Load environment dependent configuration
let env = config.get('env');

if (config.get('config_file') !== '') {
  // Load from json file
  config.loadFile(config.get('config_file'))
}

// Perform validation
config.validate({strict: true});

module.exports = config;
