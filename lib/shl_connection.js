var rp = require("request-promise"),
    extend = require("util")._extend,
    debug   = require("debug")("open-shl:connection")

const baseUrl = "https://openapi.shl.se",
    auth = "/oauth2/token";

const DEFAULTS = {
    userAgent: "OpenShl.js/1.0",
    autoConnect: true
}

function getQueryPart(key, value) {
    if(typeof key !== "string") return null;
    var encodedKey = encodeURIComponent(key);
    if(typeof value === "string") {
        return encodedKey + "=" + encodeURIComponent(value);
    }
    if(Array.isArray(value)) {
        return value
            .map(v => encodeURIComponent(key + "[]") + "=" + encodeURIComponent(v))
            .join("&");
    }
    else return encodedKey + "=" + encodeURIComponent(JSON.stringify(value));
}

function buildQuerystring(queryObject) {
    return Object.keys(queryObject)
        .map(k => getQueryPart(k, queryObject[k]))
        .filter(s => typeof s === "string" && s.length > 0)
        .join("&");
}

function isObject(obj) {
  return obj === Object(obj);
}

function Connection(options) {
    if(!options || !options.clientId || !options.clientSecret) {
        throw new Error("clientId and clientSecret must be set");
    }
    this.options = extend(DEFAULTS, options);
    debug("options: %o", {autoConnect: this.optionsautoConnect, userAgent: this.options.userAgent });
}

Connection.prototype.autoConnect = function (autoConnect) {
    this.options.autoConnect = autoConnect;
}

Connection.prototype.connect = function () {
    debug("connect: %o", baseUrl + auth);
    return this._request({
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

Connection.prototype.get = function (path, query) {
    if(!this.isConnected() && this.options.autoConnect) {
        debug("get: no valid token. refreshing")
        return this.connect().then(() => this._fetch(path));
    }
    if(query && isObject(query)) {
        path += "?" + buildQuerystring(query);
    }
    return this._fetch(path);
}

Connection.prototype.isConnected = function () {
    return this.accessToken && new Date() <= this.expires;
}

Connection.prototype._fetch = function (path) {
    if(!this.isConnected()) {
        throw new Error("No accessToken has been fetched");
    }
    debug("_fetch %o", baseUrl + path);
    return this._request({
        method: "GET",
        uri: baseUrl + path,
        headers: {
            "Authorization": "Bearer " + this.accessToken,
            "User-Agent": this.options.userAgent
        }
    })
    .then(JSON.parse);
}

Connection.prototype._request = function (options) {
    return rp(options);
}

module.exports = Connection;