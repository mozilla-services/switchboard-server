/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class Experiment {
  constructor(manager) {
    this.manager = manager;
  }

  load(experimentsString) {
    if (!experimentsString) {
      throw new Error('experimentsString is undefined');
    }

    if (!this.manager) {
      throw new Error('manager is undefined');
    }

    let experiments = JSON.parse(experimentsString);
    let results = {};

    // for each experiment
    for (let experimentKey in experiments) {
      // verify experiment is in the experiments
      if (!experiments.hasOwnProperty(experimentKey)) {
        throw new Error('experiment ' + experimentKey + ' not a property');
      }
      // assume match conditions are satisfied
      let match = true;

      // alias object because DRY
      let experiment = experiments[experimentKey];

      // check experiment match conditions (if applicable)
      if (experiment.hasOwnProperty('match') &&
        Object.keys(experiment.match).length > 0) {
        // for each key in the experiment's match conditions
        for (let matchKey in experiment.match) {
          // if match does not have matchKey
          if (!experiment.match.hasOwnProperty(matchKey)) {
            throw new Error('experiment ' + experimentKey + ' has no property ' + matchKey);
          }
          // regex match manager's value against the match requirement
          let re = new RegExp(experiment.match[matchKey]);
          if (!re.test(this.manager[matchKey])) {
            // no match
            match = false;
          }
        }
      }

      // if experiment has improper buckets property
      if (!experiment.hasOwnProperty('buckets') ||
        !experiment.buckets.hasOwnProperty('min') ||
        !experiment.buckets.hasOwnProperty('max')) {
        throw new Error('experiment ' + experimentKey +
          ' has improper buckets property: ' + experiment.buckets);
      }
      // matched requirements for this experiment
      if (match) {
        results[experimentKey] = this.manager.turnOnBucket(
          experiment.buckets.min,
          experiment.buckets.max
        );
      } else {
        // didn't match requirements for this experiment
        results[experimentKey] = this.manager.inactiveExperiment();
      }
    }

    return results;
  }

  sample() {
    // hardcoded test

    // we have a uuid
    if (typeof this.manager.uuid !== undefined) {
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

module.exports = Experiment;
