var rp = require("request-promise"),
  util = require("./util"),
  debug = require("debug")("open-shl:connection");

const baseUrl = "https://openapi.shl.se",
  auth = "/oauth2/token";

const DEFAULTS = {
  userAgent: "OpenShl.js/1.1.3",
  autoConnect: true,
};

export interface IShlConnectionOptions {
  autoConnect?: boolean;
  userAgent?: string;
  clientSecret: string;
  clientId: string;
}

interface OAuthResponse {
  access_token: string;
  expires_in: number;
}

export interface IShlConnection {
  connect(): Promise<void>;
  get(path: string, query: object): Promise<object>;
  isConnected: boolean;
  autoConnect: boolean;
}

export class ShlConnection implements IShlConnection {
  private accessToken: string;
  private expires: Date;
  constructor(private options: IShlConnectionOptions) {
    if (!options || !options.clientId || !options.clientSecret) {
      throw new Error("clientId and clientSecret must be set");
    }
    this.options = { ...DEFAULTS, ...options };
    debug("options: %o", {
      autoConnect: this.options.autoConnect,
      userAgent: this.options.userAgent,
    });
  }

  public set autoConnect(shouldAutoConnect: boolean) {
    this.options.autoConnect = shouldAutoConnect;
  }

  public async connect() {
    debug("connect: %o", baseUrl + auth);
    return this._request({
      method: "POST",
      uri: baseUrl + auth,
      form: {
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        grant_type: "client_credentials",
      },
      headers: {
        "User-Agent": this.options.userAgent,
      },
    })
      .then(JSON.parse)
      .then((body: OAuthResponse) => {
        this.accessToken = body.access_token;
        this.expires = new Date();
        this.expires.setSeconds(this.expires.getSeconds() + body.expires_in);
        debug("token: %o, expires: %o", this.accessToken, this.expires);
      });
  }

  public async get(path: string, query: Object) {
    if (query && util.isObject(query)) {
      path += "?" + util.query.convert(query);
    }
    if (!this.isConnected && this.options.autoConnect) {
      debug("get: no valid token. refreshing");
      await this.connect();
    }
    return await this._fetch(path);
  }

  public get isConnected() {
    return this.accessToken && new Date() <= this.expires;
  }

  private async _fetch(path) {
    if (!this.isConnected) {
      throw new Error("No accessToken has been fetched");
    }
    debug("_fetch %o", baseUrl + path);
    return this._request({
      method: "GET",
      uri: baseUrl + path,
      headers: {
        Authorization: "Bearer " + this.accessToken,
        "User-Agent": this.options.userAgent,
      },
    }).then(JSON.parse);
  }

  private _request(options) {
    return rp(options);
  }
}
