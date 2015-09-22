let convict = require('convict');

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
    default: 0,
    env: 'PORT'
  },
  update_server_url: {
    doc: 'The URL to update the server.',
    format: String,
    default: 'update',
    env: 'UPDATE_URL'
  },
  num_buckets: {
    doc: 'The number of S3 buckets.',
    format: Number,
    default: 100,
    env: 'NUM_BUCKETS'
  }
});

// Load environment dependent configuration
let env = config.get('env');

// Load from json file
// config.loadFile('./config/' + env + '.json')

// Perform validation
config.validate({strict: true});

module.exports = config;
