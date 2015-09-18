function SwitchboardManager(params) {
    this.lang = params.lang;
    this.manufacturer = params.manufacturer;
    this.device = params.device;
    this.uuid = params.uuid;
    this.country = params.country;
    this.version = params.version;
    this.appId = params.appId;
}

SwitchboardManager.prototype.print = function() {
    return JSON.stringify(this);
};

SwitchboardManager.prototype.getUserBucket = function() {

};

module.exports = SwitchboardManager;
