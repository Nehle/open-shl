const debug = require("debug")("open-shl:client");

function ShlClient(connection) {
    this.connection = connection;
    this.connection.autoConnect = true;
}

ShlClient.prototype.season = function (season) {
    var basePath = "/seasons/" + season
    return {
        games: () => {
            return this.connection.get(basePath + "/games")
        },
        game: gameId => {
            return this.connection.get(basePath + "/games/" + gameId)
        },
        statistics: {
            goalkeepers: () => {
              return this.connection.get(basePath + "/statistics/goalkeepers");  
            },
            players: () => {
              return this.connection.get(basePath + "/statistics/players");  
            },
            teams: {
                standings: () => {
                    return this.connection.get(basePath + "/statistics/teams/standings");                      
                }
            }
        }
    }
}

ShlClient.prototype.teams = function (teamId) {
    var path = teamId ? "/teams/" + teamId : "/teams";
    return this.connection.get(path);
}

ShlClient.prototype.videos = function () {
    return this.connection.get("/videos");
}

ShlClient.prototype.articles = function () {
    return this.connection.get("/articles");
}

module.exports = ShlClient;