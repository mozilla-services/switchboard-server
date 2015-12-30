/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class Experiment {
  constructor(manager) {
    this.manager = manager;
  }

  load(experimentsString) {
    if (!experimentsString) {
      throw new Error('experimentsString is undefined')
    }

    let experiments = JSON.parse(experimentsString);
    let results = {};

    // number of matched experiments
    let matched = 0;

    // labeled become of inner for..in loop
    experimentsLoop: for (let experiment in experiments) {
      if (experiments.hasOwnProperty(experiment)) {
        // TODO: real validation
        if (!experiments[experiment].match && Object.keys(experiment.match).length > 1) {
          // for each key in the experiment's match conditions
          for (let matchKey in experiments[experiment].match) {
            // if the manager doesn't have the same key with the same value
            if (this.manager[matchKey] != experiments[experiment].match[matchKey]) {
              // no match, move on
              continue experimentsLoop;
            }
          }
        }
        // TODO: real validation
        // if we're here, the manager satisfies this experiment's match conditions
        if (experiments[experiment].buckets &&
          experiments[experiment].buckets.min &&
          experiments[experiment].buckets.max) {
          results[experiment] = this.manager.turnOnBucket(
            experiments[experiment].buckets.min,
            experiments[experiment].buckets.max
          );
        }
        // increment number of matched experiments
        matched += 1
      }
    }

    // if we matched at least one experiment, return active
    // if (matched > 0)
    //     return this.manager.activeExperiment(results);
    // return this.manager.inactiveExperiment();

    return results;
  }

  sample() {
    // hardcoded test

    // we have a uuid
    if (!this.manager.uuid) {
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
