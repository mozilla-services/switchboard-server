import 'crc-32'

class SwitchboardManager {
    constructor(params) {
        this.lang = params.lang
        this.manufacturer = params.manufacturer
        this.device = params.device
        this.uuid = params.uuid
        this.country = params.country
        this.version = params.version
        this.appId = params.appId
    }

    getUserBucket() {

    }

    print() {
        return JSON.stringify(this)
    }
}

module.exports = SwitchboardManager
