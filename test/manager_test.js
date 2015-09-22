import * as should from 'should';
import * as assert from 'assert';

const numBuckets = 100

// manager tests
import Manager from '../manager.js'
describe('Manager', function() {
    describe('#getUserBucket()', function() {
        let manager = new Manager({'lang': 'eng'}, numBuckets);
        it('should return the hashed uuid mod numBuckets', function() {
            manager.uuid = 101;
            manager.getUserBucket().should.equal(76);
        });
        it('should work for negatives', function() {
            manager.uuid = -3;
            manager.getUserBucket().should.equal(-82);
        });
        it('should work for strings', function() {
            manager.uuid = 'foo bar qux joke string';
            manager.getUserBucket().should.equal(-49);
        });
    });
    describe('#isInBucket(low, high)', function() {
        let manager = new Manager({'lang': 'eng'}, numBuckets);
        it('should return false if low <= userBucket < high', function() {
            manager.uuid = 50;
            let bucket = manager.getUserBucket(this.uuid);
            manager.isInBucket(bucket, bucket + 1).should.be.false();
        })
        it('should return true if low == high', function() {
            manager.uuid = 50;
            let bucket = manager.getUserBucket(this.uuid);
            manager.isInBucket(bucket, bucket).should.be.true();
        })
    })
    describe('#isApplicationId()', function() {
        let manager = new Manager({'lang': 'eng'}, numBuckets);
        it('should return false if the manager\'s appId is undefined', function() {
            manager.appId = undefined;
            manager.isApplicationId(9).should.be.false();
        })
        it('should return true when values are exactly equal', function() {
            manager.appId = 10;
            manager.isApplicationId(10).should.be.true();
        })
        it('should return false when value are not exactly equal', function() {
            manager.appId = 'hello';
            manager.isApplicationId(9).should.be.false();
        })
    })
});
