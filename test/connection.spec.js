var sinon       = require("sinon"),
    rp          = require("request-promise"),
    Promise     = require("bluebird"),
    chai        = require("chai"),
    sinonChai   = require("sinon-chai"),
    debug       = require("debug")("open-shl:integration-tests"),
    Connection  = require("../lib/shl_connection");
    
var expect = chai.expect;
chai.use(sinonChai);

describe("ShlConnection", function () {
    var connection,
        sandbox;
        
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        sandbox.stub(Connection.prototype, "_request");
        var config = {clientId: "id", clientSecret: "secret"};
        connection = new Connection(config);
    });
    
    afterEach(function () {
       connection = null; 
       sandbox.restore();
    });
    
    describe("#connect", function () {
        beforeEach(function () {
            var response = JSON.stringify({access_token: "token", expires_in: 10});
            connection._request.returns(Promise.resolve(response));
        });
        
        it("only makes one request", function (done) {
            connection.connect().then(() => {
                expect(connection._request).to.have.been.calledOnce;
            })
            .then(done, done);    
        });
        
        it("sends `client_id` and `client_secret`", function (done) {
            connection.connect().then(() => {
                var args = connection._request.args[0][0];
                expect(args.form).to.contain.property("client_id","id");
                expect(args.form).to.contain.property("client_secret","secret");
            })
            .then(done, done);    
        });
        
        it("sets correct accessToken", function (done) {
           connection.connect().then(() => {
                expect(connection.accessToken).to.equal("token");
            })
            .then(done, done);    
        });
    });
    
    describe("#get", function () {
        beforeEach(function () {
            var response = JSON.stringify({foo: "bar", baz: "biz"});
            connection._request.returns(Promise.resolve(response));    
        });
        
        describe("When not connected", function () {
            beforeEach(function () {
                sandbox.stub(connection, "isConnected").returns(false);                
            });
            
            it("throws an error when `autoConnect = false`", function (done) {
                connection.get("/path/to/resource")
                .catch(e => {
                    expect(e.message).to.contain("No accessToken");
                })
                .then(done, done);
            });
            
            it("Calls `connect` if `autoConnect = true`", function (done) {
                connection.autoConnect(true);
                
                sandbox.stub(connection, "connect", () => {
                    connection.isConnected.returns(true);
                    return Promise.resolve();
                });
                
                connection.get("/").then(() => {
                    expect(connection.connect).to.have.been.calledOnce;
                    expect(connection._request).to.have.been.calledAfter(connection.connect); 
                })
                .then(done, done);
            });
        });
        
        describe("When `isConnected = true`", function () {
           beforeEach(function () {
                sandbox.stub(connection, "isConnected").returns(true);
                connection.accessToken = "token";               
           });
           
           it("Makes a request", function (done) {
                connection.get("/").then(() => {
                    expect(connection._request).to.have.been.calledOnce;
                })
                .then(done, done);
            })
            
            it("Requests correct path", function (done) {
                connection.get("/path/to/resource").then(() => {
                    var args = connection._request.args[0][0];
                    expect(args).to.have.property("uri").contains("/path/to/resource");
                })
                .then(done, done);
            });
            
            it("handles `query` string properties", function (done) {
                connection.get("/path/to/resource", {foo: "bar", qwerty: "asdf"}).then(() => {
                    var args = connection._request.args[0][0];
                    expect(args).to.have.property("uri").contains("foo=bar&qwerty=asdf");
                })
                .then(done, done);
            });
            
            it("handles `query` array properties", function (done) {
                connection.get("/path/to/resource", {arr: ["a", 3, "c"]}).then(() => {
                    var args = connection._request.args[0][0];
                    expect(args).to.have.property("uri").contains("arr%5B%5D=a&arr%5B%5D=3&arr%5B%5D=c");
                })
                .then(done, done);
            });
        });
    });
});