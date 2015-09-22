class Experiment {
    constructor(manager) {
        this.manager = manager;
    }

    sample() {
        // hardcoded test

        // we have a uuid
        if (typeof this.manager.uuid != undefined) {
            // lang is eng
            if (this.manager.lang === 'eng') {
                // manager is in first half of buckets
                if (this.manager.isInBucket(0, 50)) {
                    return this.manager.activeExperiment({
                        'message': 'hello world',
                        'messageTitle': 'in bucket 50 or lesser'
                    });
                // manager is in second half of buckets
                } else {
                    return this.manager.activeExperiment({
                        'message': 'hello world',
                        'messageTitle': 'in bucket 50 or greater'
                    });
                }
            // lang is not eng
            } else {
                return this.manager.activeExperiment({
                    'message': 'hola mundo (non-eng)',
                    'messageTitle': 'zip zap zoop'
                });
            }
        // no uuid
        } else {
            return this.manager.inactiveExperimentReturnArray();
        }
    }
}

module.exports = Experiment
