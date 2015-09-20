// packages
import express from 'express';

// local imports
import config from './config.js';
import SwitchboardManager from './manager.js';

var app = express();

app.get('/', function(req, res) {
    let manager = new SwitchboardManager(req.query);
    let results = {
        'onboarding-a': manager.turnOnBucket(0, 50),
        'onboarding-b': manager.turnOnBucket(50, 100)
    }
    res.send(JSON.stringify(results));
})

app.get('/' + config.get('update_server_url'), function(req, res) {
    res.send('update');
})

app.listen(8080)
