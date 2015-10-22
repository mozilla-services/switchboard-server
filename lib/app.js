// packages
import express from 'express';
import fs from 'fs';
import Q from 'q';
import chokidar from 'chokidar';
import logger from 'morgan';

// local imports
import config from './config.js';
import Manager from './manager.js';
import Experiment from './experiment.js';

const app = express();

// access log
var accessLogStream = fs.createWriteStream(config.get('access_log_file'), {flags: 'a'})

// morgan, logger middleware
app.use(logger('combined', {stream: accessLogStream}));

// fetch all this from config
const ip = config.get('ip');
const port = config.get('port');
const main_server_url = config.get('main_server_url');
const base_url = config.get('base_url');
const urls_url = base_url + config.get('urls_url');

const v2_url = base_url + 'v2';
const v1_url = base_url + 'v1';

// cache the experiments file
let cached_experiments_data = undefined;
let experiments_watcher = chokidar.watch(config.get('experiments_file'))

// initial cache
getCachedExperimentsData(true)

// configure watcher for experiments file
experiments_watcher.on('change', function(path, stats) {
    getCachedExperimentsData(true);
});

// gets cached or fetches cached experiments data
function getCachedExperimentsData(update = false) {
    if (update || 'undefined' === typeof cached_experiments_data) {
        updateExperimentsData().then(
            function(data) {
                cached_experiments_data = data;
                return data;
            }
        )
    } else {
        return cached_experiments_data;
    }
}

// convenience function to make an Experiment and Manager
function makeExperiment(req) {
    let manager = new Manager(req.query, config.get('num_buckets'));
    let experiment = new Experiment(manager);
    return experiment;
}

// return contents of experiments_file
function updateExperimentsData() {
    let deferred = Q.defer();
    const experiments_file = config.get('experiments_file');
    if ('' === experiments_file || 'undefined' === typeof experiments_file) {
        deferred.reject('blank experiments_file');
    } else {
        fs.readFile(experiments_file, 'utf8', function(err, data) {
            if (err) {
                deferred.reject('could not read experiments_file');
            } else {
                deferred.resolve(data);
            }
        });
    };
    return deferred.promise;
}

// v1 route
app.get(v1_url, function(req, res) {
    res.set('Content-Type', 'application/json').json(makeExperiment(req).load(getCachedExperimentsData()));
});

// v2 route - returns the mainServerUrl as well
app.get(v2_url, function(req, res) {
    res.set('Content-Type', 'application/json').json({
        'mainServerUrl': main_server_url + v2_url,
        'results': makeExperiment(req).load(getCachedExperimentsData()),
    });
});

// urls route
app.get(urls_url, function(req, res) {
    res.set('Content-Type', 'application/json').json({
        // this route, where server routes are gotten
        // kept for backwards compatiability
        'updateServerUrl': main_server_url + urls_url,

        // the mainServerUrl (v1)
        'mainServerUrl': main_server_url + v1_url,
    });
});

app.listen(port, ip);

module.exports = app;
