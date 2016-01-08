var rp = require("request-promise"),
    extend = require("util")._extend;

const baseUrl = "http://openapi.shl.se",
    auth = "/oauth2/token";

const DEFAULTS = {
    userAgent: "OpenShl.js/1.0",
    autoRefresh: true
}

function Connection(options) {
    if(!options || !options.clientId || !options.clientSecret) {
        throw new Error("clientId and clientSecret must be set");
    }
    this.options = extend(DEFAULTS, options);
}

Connection.prototype.connect = function() {
    return rp({
        method: "POST",
        uri: baseUrl + auth,
        form: {
            client_id: this.options.clientId,
            client_secret: this.options.clientSecret,
            grant_type: "client_credentials"
        } 
    }).then((body) => {
        this.accessToken = body.accessToken;
        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + body.expires);
    });
}

module.exports = Connection;