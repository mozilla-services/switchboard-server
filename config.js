var convict = require('convict')

var config = convict({
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
  }
})

// Load environment dependent configuration
var env = config.get('env')
// config.loadFile('./config/' + env + '.json')

// Perform validation
config.validate({strict: true})

module.exports = config
