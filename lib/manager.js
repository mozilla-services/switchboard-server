import crc from 'crc';

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
            return true;
        else
            return false;
    };

    turnOnBucket(low, high) {
        if (typeof this.uuid != 'undefined' && this.uuid !== '' && this.isInBucket(low, high))
                return this.activeExperiment();
        return this.inactiveExperiment();
    };

    isApplicationId(applicationId) {
        // check for undefined appId
        return typeof this.appId != 'undefined' && applicationId === this.appId;
    };

    getUserBucket() {
        // gets checksum from uuid, sorts into a bucket using crc32 hash
        if (typeof this.uuid != 'undefined')
            return crc.crc32(this.uuid.toString()) % this.numBuckets;
        return 0;
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
