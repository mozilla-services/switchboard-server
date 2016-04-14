/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global it */
 /* global describe */

'use strict';

import request from 'supertest';
import chai from 'chai';
const should = chai.should();

// switchboard-server app, config
import app from '../lib/app.js';
import config from '../lib/config.js';

// note: npm test uses experimentsFile = ../config/experiments.json

// fetch all this from config
const mainServerUrl = config.get('mainServerUrl');
const baseUrl = config.get('baseUrl');
const urlsUrl = baseUrl + config.get('urlsUrl');

const v2Url = `${baseUrl}v2`;
const v1Url = `${baseUrl}v1`;

describe('GET /v1 with lang = eng and uuid = foo', () => {
  it('should respond with JSON', (done) => {
    request(app)
      .get(`${v1Url}/?lang=eng`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('if uuid is given, one of onboarding-a or onboarding-b should be active', (done) => {
    request(app)
      .get(`${v1Url}/?lang=eng&uuid=foo`)
      .set('Accept', 'application/json')
      .expect((res) => {
        res.body['onboarding-a'].isActive.
        should.not.be.equal(res.body['onboarding-b']);
      })
      .expect(200, done);
  });
});

describe('GET /v2 with lang = eng and uuid = foo', () => {
  it('should respond with JSON', (done) => {
    request(app)
      .get(`${v2Url}/?uuid=foo`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('if uuid is given, one of onboarding-a or onboarding-b should be active', (done) => {
    request(app)
      .get(`${v2Url}/?lang=eng&uuid=foo`)
      .set('Accept', 'application/json')
      .expect((res) => {
        res.body.results['onboarding-a'].isActive.
        should.not.be.equal(res.body.results['onboarding-b']);
      })
      .expect(200, done);
  });
});

describe('GETs to /v1', () => {
  it('should respond with JSON', (done) => {
    request(app)
      .get(`${v2Url}/?uuid=foo`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('if uuid is given, one of onboarding-a or onboarding-b should be active', (done) => {
    request(app)
      .get(`${v2Url}/?lang=eng&uuid=foo`)
      .set('Accept', 'application/json')
      .expect((res) => {
        if (res.body.results['onboarding-a'].isActive !== true &&
          res.body.results['onboarding-b'].isActive !== true) {
          throw new Error('one of onboarding-a or onboarding-b should be true');
        }
      })
      .expect(200, done);
  });
  it('should pass on values object if the experiment is satisfied', (done) => {
    request(app)
      .get(`${v1Url}/?uuid=foo`)
      .set('Accept', 'application/json')
      .expect((res) => {
        should.exist(res.body['onboarding-b'].values);
      })
      .expect(200, done);
  });
  it('values should be null if the experiment is not satisfied', (done) => {
    request(app)
      .get(`${v1Url}/?uuid=foo`)
      .set('Accept', 'application/json')
      .expect((res) => {
        should.equal(res.body['onboarding-a'].values, null);
      })
      .expect(200, done);
  });
  it('should require exact string matches for appId no regex syntax is used', (done) => {
    request(app)
      .get(`${v1Url}/?uuid=test&appId=org.mozilla.fennec_aurora`)
      .set('Accept', 'application/json')
      .expect((res) => {
        if (res.body.fennec_aurora.isActive !== true) {
          throw new Error('fennec_aurora is not active and should be');
        }
        if (res.body.fennec.isActive === true) {
          throw new Error('fennec is active and should not be');
        }
      })
      .expect(200, done);
  });
});

describe('GETs to /urls', () => {
  it('should respond with JSON', (done) => {
    request(app)
      .get(`${urlsUrl}/?uuid=foo`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('should have a mainServerUrl and a updateServerUrl', (done) => {
    request(app)
      .get(urlsUrl)
      .set('Accept', 'application/json')
      .expect((res) => {
        res.body.mainServerUrl.should.equal(mainServerUrl + v1Url);
        res.body.updateServerUrl.should.equal(mainServerUrl + urlsUrl);
      })
      .expect(200, done);
  });
});
