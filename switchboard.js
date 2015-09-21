// packages
import express from 'express';

// local imports
import config from './config.js';
import Manager from './manager.js';
import Experiments from './experiments.js';

var app = express();

app.get('/', function(req, res) {
    let manager = new Manager(req.query, config.get('num_buckets'));
    let experiments = new Experiments(manager);
    let results = {
        'onboarding-a': manager.turnOnBucket(0, 50),
        'onboarding-b': manager.turnOnBucket(50, 100)
    }
    // let results = experiments.sample();
    res.send(JSON.stringify(results));
})

app.get('/' + config.get('update_server_url'), function(req, res) {
    res.send('update');
})

app.listen(8080)
