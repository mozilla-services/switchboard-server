import request from 'supertest';
import * as should from 'should';

// switchboard-server app, config
import app from '../index.js';
import config from '../lib/config.js';

// fetch all this from config
const ip = config.get('ip');
const port = config.get('port');
const main_server_url = config.get('main_server_url');
const urls_url = config.get('urls_url');

const v2_url = main_server_url + 'v2';
const v1_url = main_server_url + 'v1';

describe('GET / with lang = eng', function() {
    it('should respond with JSON', function(done) {
        request(app)
            .get(v1_url + '/?lang=eng')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
    it('if the app is active, it should respond as active', function(done) {
        request(app)
            .get(v1_url + '/?lang=eng?uuid=foo')
            .set('Accept', 'application/json')
            .expect(function(res) {
                let jsonResponse = JSON.parse(res.body);
                console.log(jsonResponse);
                // if (jsonResponse['onboarding-a'].isActive != true) {
                //     throw new Error('onboarding-a should be ' + true + ', reported ' + jsonResponse['onboarding-a'].isActive)
                // }
            })
            .expect(200, done);
    })
})
