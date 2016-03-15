To install dependencies:
npm install

To install dev dependencies, such as for running tests:
npm install --dev

To run the server:
npm start

Note: the above uses CONFIG_FILE=config/example_config.json by default.
This can be changed in your package.json, or you can simply run ```CONFIG_FILE=/path/to/config.json node index.js``` yourself.

To run the tests:
npm test


The config file must have experimentsFile set, or the server will fail.
For testing, setting the EXPERIMENTS_FILE env variable instead of CONFIG_FILE is sufficient.

By default, switchboard-server listens on localhost:8080.
