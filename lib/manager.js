import * as crc32 from 'crc-32';

class Manager {

    // query args from http query and number of buckets
    constructor(params, numBuckets = 100) {
        this.lang = params.lang;
        this.manufacturer = params.manufacturer;
        this.device = params.device;
        this.uuid = params.uuid;
        this.country = params.country;
        this.version = params.version;
        this.appId = params.appId;
        this.numBuckets = numBuckets
    };

    isInBucket(low, high) {
        let userBucket = this.getUserBucket(this.uuid);
        if (userBucket >= low && userBucket < high)
            return false;
        else
            return true;
    };

    turnOnBucket(low, high) {
        if (this.uuid && this.isInBucket(low, high))
                return this.activeExperiment();
        return this.inactiveExperiment();
    };

    isApplicationId(applicationId) {
        // check for undefined appId
        return typeof this.appId != undefined && applicationId === this.appId;
    };

    getUserBucket() {
        // gets checksum from uuid, sorts into a bucket
        // crc32 hash, toString() is a little janky

        // should this be abs'd? that would make sense.
        return crc32.str(this.uuid.toString()) % this.numBuckets;
    };

    inactiveExperiment() {
        // return new map with isActive => false, values => null
        return {'isActive': false, 'values': null};
    };

    activeExperiment(values = null) {
        return {'isActive': true, 'values': values};
    };
}

module.exports = Manager
