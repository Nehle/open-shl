var pick = require("lodash.pick");

function ShlClient(connection) {
    this.connection = connection;
    this.connection.autoConnect(true);
}

ShlClient.prototype.season = function (season) {
    var basePath = "/seasons/" + season
    return {
        games: query => {
            return this.connection.get(basePath + "/games", pick(query, "teamIds"))
        },
        game: gameId => {
            return this.connection.get(basePath + "/games/" + gameId)
        },
        statistics: {
            goalkeepers: query => {
              return this.connection.get(basePath + "/statistics/goalkeepers", pick(query, ["teamIds", "sort"]));  
            },
            players: query => {
              return this.connection.get(basePath + "/statistics/players", pick(query, ["teamIds", "sort"]));  
            },
            teams: {
                standings: query => {
                    return this.connection.get(basePath + "/statistics/teams/standings", pick(query, ["teamIds"]));                      
                }
            }
        }
    };
};

ShlClient.prototype.teams = function () {
    return this.connection.get("/teams");
};

ShlClient.prototype.team = function (teamId) {
    var path = "/teams/" + teamId;
    return this.connection.get(path);
};

ShlClient.prototype.videos = function (query) {
    return this.connection.get("/videos", pick(query, ["teamIds"]));
};

ShlClient.prototype.articles = function (query) {
    return this.connection.get("/articles", pick(query, ["teamIds"]));
};

module.exports = ShlClient;