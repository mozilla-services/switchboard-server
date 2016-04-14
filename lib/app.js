/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

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

const v2Url = `${baseUrl}v2`;
const v1Url = `${baseUrl}v1`;

// initialize app
const app = express();

// log settings
mozlog.config({
  app: 'switchboard',
  level: 'verbose',
  fmt: 'heka',
  debug: config.get('debug'),
  stream: process.stdout,
});

// initialize logger
const log = mozlog('routes.client.register');

// return contents of experimentsFile
function updateExperimentsData() {
  const deferred = Q.defer();
  const experimentsFile = config.get('experimentsFile');

  if (experimentsFile === '' || !experimentsFile) {
    deferred.reject('blank experimentsFile');
  } else {
    fs.readFile(experimentsFile, 'utf8', (err, data) => {
      if (err) {
        log.debug('updateExperimentsError', {
          err,
        });
        deferred.reject('could not read experimentsFile');
      } else {
        log.debug('updateExperimentsData', {
          data,
        });
        deferred.resolve(data);
      }
    });
  }
  return deferred.promise;
}

// cache the experiments file
let cachedExperimentsData = undefined;
const experimentsWatcher = chokidar.watch(config.get('experimentsFile'));

// gets cached or fetches cached experiments data
function getCachedExperimentsData(update = false) {
  if (update || !cachedExperimentsData) {
    updateExperimentsData().then((data) => {
      cachedExperimentsData = data;
      return data;
    });
  }
  return cachedExperimentsData;
}

// initial cache
getCachedExperimentsData(true);

// configure watcher for experiments file
experimentsWatcher.on('change', () => getCachedExperimentsData(true));

// convenience function to make an Experiment and Manager
function makeExperiment(req) {
  const manager = new Manager(req.query, config.get('numBuckets'));
  const experiment = new Experiment(manager);
  return experiment;
}


// / route
app.get([baseUrl, '/__heartbeat__'], (req, res) => {
  res.set('Content-Type', 'application/json').json({});
});

// v1 route
app.get(v1Url, (req, res) => {
  res.set('Content-Type', 'application/json').
    json(makeExperiment(req).
    load(getCachedExperimentsData()));
});

// v2 route - returns the mainServerUrl as well
app.get(v2Url, (req, res) => {
  res.set('Content-Type', 'application/json').
    json({
      mainServerUrl: mainServerUrl + v2Url,
      results: makeExperiment(req).load(getCachedExperimentsData()),
    });
});

// urls route
app.get(urlsUrl, (req, res) => {
  res.set('Content-Type', 'application/json').json({
    // this route, where server routes are gotten
    // kept for backwards compatiability
    updateServerUrl: mainServerUrl + urlsUrl,

    // the mainServerUrl (v1)
    mainServerUrl: mainServerUrl + v1Url,
  });
});

app.listen(port, ip);

module.exports = app;
