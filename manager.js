import * as crc32 from 'crc-32';

class SwitchboardManager {
    constructor(params) {
        this.lang = params.lang;
        this.manufacturer = params.manufacturer;
        this.device = params.device;
        this.uuid = params.uuid;
        this.country = params.country;
        this.version = params.version;
        this.appId = params.appId;
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
        // playing around appId being undefined
        return applicationId == this.appId && this.appid != undefined;
    };

    getUserBucket() {
        // gets checksum from uuid, sorts into a bucket
        // TODO: move to config
        const numBuckets = 100;
        let bucket = crc32(this.uuid) % numBuckets;
        return bucket;
    };

    print() {
        return JSON.stringify(this);
    };

    inactiveExperiment() {
        // return new map with isActive => false, values => null
        return {'isActive': false, 'values': null};
    };

    activeExperiment(values = null) {
        return {'isActive': true, 'values': values};
    };
}

module.exports = SwitchboardManager
