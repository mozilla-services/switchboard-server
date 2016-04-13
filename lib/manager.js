/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import crc from 'crc';

class Manager {
  // query args from http query and number of buckets
  constructor(params, numBuckets = 100) {
    this.numBuckets = numBuckets;

    for (const param in params) {
      if (params.hasOwnProperty(param)) {
        this[param] = params[param];
      }
    }
  }

  isInBucket(low, high) {
    const userBucket = this.getUserBucket(this.uuid);
    if (userBucket >= low && userBucket < high) {
      return true;
    }
    return false;
  }

  turnOnBucket(low, high, values = null) {
    if (this.hasOwnProperty('uuid') &&
      this.uuid !== '' &&
      this.isInBucket(low, high)) {
      return this.activeExperiment(values);
    }
    return this.inactiveExperiment();
  }

  getUserBucket() {
    // gets checksum from uuid, sorts into a bucket using crc32 hash
    if (!this.uuid) {
      return 0;
    }
    return crc.crc32(this.uuid.toString()) % this.numBuckets;
  }

  inactiveExperiment() {
    // return object with isActive => false, values => null
    return {
      isActive: false,
      values: null,
    };
  }

  activeExperiment(values) {
    return {
      isActive: true,
      values,
    };
  }
}

module.exports = Manager;
