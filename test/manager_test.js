/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global it */
/* global describe */

const numBuckets = 100;

// manager tests
import Manager from '../lib/manager.js';
import chai from 'chai';

const should = chai.should();

describe('Manager', () => {
  describe('#getUserBucket()', () => {
    const manager = new Manager({ lang: 'eng' }, numBuckets);
    it('should return the hashed uuid mod numBuckets', () => {
      manager.uuid = 101;
      manager.getUserBucket().should.equal(76);
    });
    it('should return the hashed uuid mod numBuckets', () => {
      manager.uuid = 50;
      manager.getUserBucket().should.equal(89);
    });
    it('should work for negatives', () => {
      manager.uuid = -3;
      manager.getUserBucket().should.equal(14);
    });
    it('should work for strings', () => {
      manager.uuid = 'foo bar qux joke string';
      manager.getUserBucket().should.equal(47);
    });
  });
  describe('#isInBucket(low, high)', () => {
    const manager = new Manager({ lang: 'eng' }, numBuckets);
    it('should return true if low <= userBucket < high', () => {
      manager.uuid = 50;
      const bucket = manager.getUserBucket(manager.uuid);
      manager.isInBucket(bucket, bucket + 1).should.equal(true);
    });
    it('should return false if low == high', () => {
      manager.uuid = 50;
      const bucket = manager.getUserBucket(manager.uuid);
      manager.isInBucket(bucket, bucket).should.equal(false);
    });
    it('should return false if low > high', () => {
      manager.uuid = 50;
      const bucket = manager.getUserBucket(manager.uuid);
      manager.isInBucket(bucket + 1, bucket).should.equal(false);
    });
  });
});
