var rp = require("request-promise"),
    extend = require("util")._extend;
    debug   = require("debug")("open-shl:connection")

const baseUrl = "https://openapi.shl.se",
    auth = "/oauth2/token";

const DEFAULTS = {
    userAgent: "OpenShl.js/1.0",
    autoConnect: true
}

function Connection(options) {
    if(!options || !options.clientId || !options.clientSecret) {
        throw new Error("clientId and clientSecret must be set");
    }
    this.options = extend(DEFAULTS, options);
    debug("options: %o", {autoConnect: this.autoConnect, userAgent: this.userAgent });
}

Connection.prototype.connect = function () {
    debug("connect: %o", baseUrl + auth);
    return rp({
        method: "POST",
        uri: baseUrl + auth,
        form: {
            client_id: this.options.clientId,
            client_secret: this.options.clientSecret,
            grant_type: "client_credentials"
        },
        headers: {
            "User-Agent": this.options.userAgent
        }
    })
    .then(JSON.parse)
    .then((body) => {        
        this.accessToken = body.access_token;
        this.expires = new Date();
        this.expires.setSeconds(this.expires.getSeconds() + body.expires_in);
        debug("token: %o, expires: %o", this.accessToken, this.expires);
    });
}

Connection.prototype.get = function (path) {
    if(!this.isConnected() && this.autoConnect) {
        debug("get: no valid token. refreshing")
        return this.connect().then(() => this._fetch(path));
    }
    return this._fetch(path);
}

Connection.prototype.isConnected = function () {
    return this.accessToken && new Date() <= this.expires;
}

Connection.prototype._fetch = function (path) {
    if(!this.accessToken) {
        throw new Error("No accessToken has been fetched");
    }
    debug("_fetch %o", baseUrl + path);
    return rp({
        method: "GET",
        uri: baseUrl + path,
        headers: {
            "Authorization": "Bearer " + this.accessToken,
            "User-Agent": this.options.userAgent
        }
    })
    .then(JSON.parse);
}

module.exports = Connection;