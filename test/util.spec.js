var util    = require("../lib/util"),  
    expect  = require("chai").expect;

describe("Util", function () {
    describe("#isObject", function () {
        it("is `true` for plain objects", function () {
            expect(util.isObject({})).to.be.true; 
            expect(util.isObject(new Object())).to.be.true; 
        });

        it("is `false` for arrays", function () {
            expect(util.isObject(new Array())).to.be.false;             
            expect(util.isObject([])).to.be.false;             
            expect(util.isObject([1,2])).to.be.false;             
        });

        it("is `false` for instantiated classes", function () {
            expect(util.isObject(new Date())).to.be.false;           
        });

        it("is `false` for primitives", function () {
            expect(util.isObject(1)).to.be.false; 
            expect(util.isObject(null)).to.be.false; 
            expect(util.isObject(undefined)).to.be.false; 
            expect(util.isObject("string")).to.be.false; 
        });
    });

    describe(".query", function () {
        describe("#convertSingle", function () {
            it("converts strings to plain key=value", function () {
                var qs = util.query.convertSingle("foo", "bar")
                expect(qs).to.equal("foo=bar"); 
            });
            
            it("encodes uri components in strings", function () {
                var qs = util.query.convertSingle("weird", "&$;!@")
                expect(qs).to.equal("weird=%26%24%3B!%40"); 
            });
            
            it("expands arrays", function () {
            var qs = util.query.convertSingle("foo", ["one","two", "three"]);
            expect(qs).to.equal("foo%5B%5D=one&foo%5B%5D=two&foo%5B%5D=three"); 
            });
            
            it("converts undefined values to strings", function () {
                var qs = util.query.convertSingle("key");
                expect(qs).to.equal("key=undefined");             
            });
            
            it("converts null values to strings", function () {
                var qs = util.query.convertSingle("key", null);
                expect(qs).to.equal("key=null");             
            });
            
            it("converts unknown objects to JSON", function () {
                var qs = util.query.convertSingle("foo", {date: new Date(0), str: "str", int: 42, arr: [1,2]});
                expect(qs).to.equal("foo=%7B%22date%22%3A%221970-01-01T00%3A00%3A00.000Z%22%2C%22str%22%3A%22str%22%2C%22int%22%3A42%2C%22arr%22%3A%5B1%2C2%5D%7D");
            });
        });
    
        describe("#convert", function () {
            it("builds a query string from an object", function () {
                var qs = util.query.convert({key: "value", array: [1,2,3]});
                expect(qs).to.equal("key=value&array%5B%5D=1&array%5B%5D=2&array%5B%5D=3"); 
            });
            
            it("Handles null values as strings", function () {
                var qs = util.query.convert({key1: "value", key2: undefined, key3: null, key4: "", key5: 0});
                expect(qs).to.equal("key1=value&key2=undefined&key3=null&key4=&key5=0");
            });
        });
    });
});