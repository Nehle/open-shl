var util = {
    query: {
        convertSingle: function (key, value) {
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
        },

        convert: function (queryObject) {
            return Object.keys(queryObject)
                .map(k => this.convertSingle(k, queryObject[k]))
                .filter(s => typeof s === "string" && s.length > 0)
                .join("&");
        }
    },
    
    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]"
    } 
};

module.exports = util;