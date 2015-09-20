let convict = require('convict');

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
  }
});

// Load environment dependent configuration
let env = config.get('env');
// config.loadFile('./config/' + env + '.json')

// Perform validation
config.validate({strict: true});

module.exports = config;
