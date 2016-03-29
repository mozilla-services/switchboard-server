/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const numBuckets = 100;

// manager tests
import Manager from '../lib/manager.js';

describe('Manager', function() {
    describe('#getUserBucket()', function() {
        let manager = new Manager({'lang': 'eng'}, numBuckets);
        it('should return the hashed uuid mod numBuckets', function() {
            manager.uuid = 101;
            manager.getUserBucket().should.equal(76);
        });
        it('should return the hashed uuid mod numBuckets', function() {
            manager.uuid = 50;
            manager.getUserBucket().should.equal(89);
        });
        it('should work for negatives', function() {
            manager.uuid = -3;
            manager.getUserBucket().should.equal(14);
        });
        it('should work for strings', function() {
            manager.uuid = 'foo bar qux joke string';
            manager.getUserBucket().should.equal(47);
        });
    });
    describe('#isInBucket(low, high)', function() {
        let manager = new Manager({'lang': 'eng'}, numBuckets);
        it('should return true if low <= userBucket < high', function() {
            manager.uuid = 50;
            let bucket = manager.getUserBucket(this.uuid);
            manager.isInBucket(bucket, bucket + 1).should.be.true();
        });
        it('should return false if low == high', function() {
            manager.uuid = 50;
            let bucket = manager.getUserBucket(this.uuid);
            manager.isInBucket(bucket, bucket).should.be.false();
        });
        it('should return false if low > high', function() {
            manager.uuid = 50;
            let bucket = manager.getUserBucket(this.uuid);
            manager.isInBucket(bucket + 1, bucket).should.be.false();
        });
    });
});
