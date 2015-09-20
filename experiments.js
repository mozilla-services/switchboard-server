class Experiment {
    constructor(manager) {
        this.manager = manager;
    }

    sample() {
        if (this.manager.uuid) {
            // return sample
        } else {
            return this.manager.inactiveExperimentReturnArray();
        }
    }
}
