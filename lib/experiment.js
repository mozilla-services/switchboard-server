class Experiment {
    constructor(manager) {
        this.manager = manager;
    }

    sample() {
        // hardcoded test
        if (this.manager.uuid) {
            if (this.manager.lang === 'eng') {
                if (this.manager.isInBucket(0, 50)) {
                    return this.manager.activeExperiment({
                        'message': 'hello world',
                        'messageTitle': 'in bucket 50 or lesser'
                    });
                } else {
                    return this.manager.activeExperiment({
                        'message': 'hello world',
                        'messageTitle': 'in bucket 50 or greater'
                    });
                }
            } else {
                return this.manager.activeExperiment({
                    'message': 'hola mundo (non-eng)',
                    'messageTitle': 'zip zap zoop'
                });
            }
        } else {
            return this.manager.inactiveExperimentReturnArray();
        }
    }
}

module.exports = Experiment
