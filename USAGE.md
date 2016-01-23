To install dependencies:
npm install

To run the server:
CONFIG_FILE=/path/to/config.json node index.js

or if using nodemon:
CONFIG_FILE=/path/to/config.json nodemon index.js

The config file must have experimentsFile set, or the server will fail.
For testing, setting the EXPERIMENTS_FILE env variable instead of CONFIG_FILE is sufficient.

By default, listens on localhost:8080.
