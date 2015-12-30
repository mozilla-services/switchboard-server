/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// packages
import express from 'express';
import fs from 'fs';
import Q from 'q';
import chokidar from 'chokidar';
import mozlog from 'mozlog';

// local imports
import config from './config.js';
import Manager from './manager.js';
import Experiment from './experiment.js';

// fetch all this from config
const ip = config.get('ip');
const port = config.get('port');
const mainServerUrl = config.get('mainServerUrl');
const baseUrl = config.get('baseUrl');
const urlsUrl = baseUrl + config.get('urlsUrl');

const v2_url = baseUrl + 'v2';
const v1_url = baseUrl + 'v1';

// initialize app
const app = express();

// initialize logger
let log = mozlog.config({
    app: 'switchboard',
    level: 'verbose',
    fmt: 'heka',
    debug: config.get('debug'),
    stream: process.stdout
})

// cache the experiments file
let cached_experiments_data = undefined;
let experiments_watcher = chokidar.watch(config.get('experimentsFile'))

// initial cache
getCachedExperimentsData(true)

// configure watcher for experiments file
experiments_watcher.on('change', function(path, stats) {
    getCachedExperimentsData(true);
});

// gets cached or fetches cached experiments data
function getCachedExperimentsData(update = false) {
    if (update || !cached_experiments_data) {
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
    let manager = new Manager(req.query, config.get('numBuckets'));
    let experiment = new Experiment(manager);
    return experiment;
}

// return contents of experimentsFile
function updateExperimentsData() {
    let deferred = Q.defer();
    const experimentsFile = config.get('experimentsFile');
    if ('' === experimentsFile || !experimentsFile) {
        deferred.reject('blank experimentsFile');
    } else {
        fs.readFile(experimentsFile, 'utf8', function(err, data) {
            if (err) {
                deferred.reject('could not read experimentsFile');
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
        'mainServerUrl': mainServerUrl + v2_url,
        'results': makeExperiment(req).load(getCachedExperimentsData()),
    });
});

// urls route
app.get(urlsUrl, function(req, res) {
    res.set('Content-Type', 'application/json').json({
        // this route, where server routes are gotten
        // kept for backwards compatiability
        'updateServerUrl': mainServerUrl + urlsUrl,

        // the mainServerUrl (v1)
        'mainServerUrl': mainServerUrl + v1_url,
    });
});

app.listen(port, ip);

module.exports = app;
