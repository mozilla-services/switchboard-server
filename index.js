// packages
import express from 'express';
import fs from 'fs';
import * as Q from 'q';
import * as domain from 'domain';

const d = domain.create();

// handle exceptions
d.on('error', function(err) {
    console.error(err);
});

// local imports
import config from './lib/config.js';
import Manager from './lib/manager.js';
import Experiment from './lib/experiment.js';

const app = express();

// fetch all this from config
const ip = config.get('ip');
const port = config.get('port');
const main_server_url = config.get('main_server_url');
const urls_url = config.get('urls_url');

const v2_url = main_server_url + 'v2';
const v1_url = main_server_url + 'v1';

function getExperiment(req) {
    let manager = new Manager(req.query, config.get('num_buckets'));
    let experiment = new Experiment(manager);
    return experiment;
}

function updateExperiments() {
    let deferred = Q.defer();
    // prevent exceptions, run in domain
    d.run(function() {
        fs.readFile(config.get('experiments_file'), 'utf8', function(err, data) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(data);
        })
    });
    return deferred.promise;
}

// v1 route
app.get(v1_url, function(req, res) {
    // uses promises
    updateExperiments().then(function(data) {
        res.set('Content-Type', 'application/json').json(getExperiment(req).load(data));
    });
});

// v2 route - returns the mainServerUrl as well
app.get(v2_url, function(req, res) {
    // uses promises
    updateExperiments().then(function(data) {
        res.set('Content-Type', 'application/json').json({
            'mainServerUrl': ip + ':' + port + v2_url,
            'results': getExperiment(req).load(data),
        });
    });
});

// urls route
app.get(urls_url, function(req, res) {
    res.set('Content-Type', 'application/json').json({
        // this route, where server routes are gotten
        // kept for backwards compatiability
        'updateServerUrl': ip + ':' + port + urls_url,

        // the mainServerUrl (v1)
        'mainServerUrl': ip + ':' + port + v1_url,
    });
});

app.listen(port, ip);

module.exports = app;
