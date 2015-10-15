import request from 'supertest';
import should from 'should';

// switchboard-server app, config
import app from '../lib/app.js';
import config from '../lib/config.js';

// example experiments to test
// gets dirname (test), goes up a dir to config
config.set('experiments_file', __dirname + '/../config/experiments.json')

// fetch all this from config
const ip = config.get('ip');
const port = config.get('port');
const main_server_url = config.get('main_server_url');
const base_url = config.get('base_url');
const urls_url = base_url + config.get('urls_url');

const v2_url = base_url + 'v2';
const v1_url = base_url + 'v1';

describe('GET /v1 with lang = eng and uuid = foo', function() {
    it('should respond with JSON', function(done) {
        request(app)
            .get(v1_url + '/?lang=eng')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
    it('if uuid is given, one of onboarding-a or onboarding-b should be active', function(done) {
        request(app)
            .get(v1_url + '/?lang=eng&uuid=foo')
            .set('Accept', 'application/json')
            .expect(function(res) {
                if (res.body['onboarding-a'].isActive != true &&
                    res.body['onboarding-b'].isActive != true) {
                        throw new Error('one of onboarding-a or onboarding-b should be true')
                }
            })
            .expect(200, done);
    })
})

describe('GET /v2 with lang = eng and uuid = foo', function() {
    it('should respond with JSON', function(done) {
        request(app)
            .get(v2_url + '/?uuid=foo')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
    it('if uuid is given, one of onboarding-a or onboarding-b should be active', function(done) {
        request(app)
            .get(v2_url + '/?lang=eng&uuid=foo')
            .set('Accept', 'application/json')
            .expect(function(res) {
                if (res.body['results']['onboarding-a'].isActive != true &&
                    res.body['results']['onboarding-b'].isActive != true) {
                        throw new Error('one of onboarding-a or onboarding-b should be true')
                }
            })
            .expect(200, done);
    })
})
