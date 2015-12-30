/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import request from 'supertest';
import should from 'should';

// switchboard-server app, config
import app from '../lib/app.js';
import config from '../lib/config.js';

// note: npm test uses experimentsFile = ../config/experiments.json

// fetch all this from config
const ip = config.get('ip');
const port = config.get('port');
const mainServerUrl = config.get('mainServerUrl');
const baseUrl = config.get('baseUrlbaseUrl');
const urlsUrl = baseUrl + config.get('urlsUrl');

const v2_url = baseUrl + 'v2';
const v1_url = baseUrl + 'v1';

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
