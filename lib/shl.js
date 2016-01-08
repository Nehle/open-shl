const Connection = require("./shl_connection");
const ShlClient = require("./shl_client");

function connect(options) {
    return new ShlClient(new Connection(options));
}

module.exports = {
    connect: connect
};