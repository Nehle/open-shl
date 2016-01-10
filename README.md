#open-shl

Node.js client for the open SHL (Swedish Hockey League) API. Developed with and for node.js 5+

## Install

`npm install --save open-shl`

## Usage

First make sure you have a valid `clientId` and `clientSecret` for the API, 
which can be gained by emailing support@shl.se

After that, you can access the api thusly:

```javascript
const shl = require("open-shl");
const options = {
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    userAgent: "YourUserAgent" // Optional 
}
const client = shl.connect(options);
```

### The SHL API

This client is built to mimic the API as documented on http://doc.openapi.shl.se

Many methods support extra query parameters, if they are supported in the API 
they can be supplied in an optional `query` argument as final (or only) parameter 
to the matching method. Most of the time this is the `teamId`, which is supplied
as an array of three letter team codes.

#### `client.season(season)`
**Parameters** 
 - `season: int`: The year the season started

**Returns**
 - `season`: The `season` API object

#### `season.games([query])`
Fetches all games for the season

**Query Properties**
 - `teamIds: string[]`: List of team codes of to include. Leave empty to include all teams
 
**Returns**
 - `Promise<Game[]>`: Promise of all games for the season

#### `season.game(gameId)`
Fetches a specific games

**Parameters**
 - `gameId: int`: Id for the game to fetch

**Returns**
 - `Promise<Game>`: The game with the specified id


#### `season.statistics.goalkeepers([query])`
Gets the top goalkeepers for the season

**Query Properties**
 - `teamIds: string[]`: List of teams to include. Leave empty to include all teams
 - `sort: string`: What attribute to sort on: `saves|savesPercent|goalsAgainst|goalsAgainstAverage|won|tied|lost|shooutOuts|minutesInPlay`
 
**Returns**
 - `Promise<GoalkeeperStatistics[]>`: Statistics for all goalkeepers during that season 

#### `season.statistics.players([query])`
Gets the top players for the season

**Query Properties**
 - `teamIds: string[]`: List of teams to include. Leave empty to include all teams
 - `sort: string`: What attribute to sort the players on `assists|goals|points|pim|hits|plusminus`

**Returns**
 - `Promise<PlayerStatistics[]>`: Statistics for top players during that season 

#### `season.statistics.teams.standings([query])`
Get current standings for that season

**Query Properties**
 - `teamIds: string[]`: List of teams to include. Leave empty to include all teams
 
**Returns**
 - `Promise<TeamStandings[]>`: List of all teams and their current standing

#### `client.teams()`
Get a list of all teams

**Returns**
 - `Promise<Fact[]>`: A list of basic facts for all teams in the SHL

#### `client.team(teamCode)`
Get details for a particular team.

**Parameters**
 - `teamCode: String`: is the three-character team code. i.e. "FHC" for Frölunda HC

**Returns**
 - `Promise<Team>`: All information about the requested team. Includes team facts, player facts and more
 
#### `client.videos([query])`
Get the ten latest videos

**Query Properties**
 - `teamIds: string[]`: List of teams to include. Leave empty to include all teams
 
**Returns**
 - `Promise<Video[]>`: Ten latest videos
 
#### `client.articles([query])`
Get the latest articles 

**Query Properties**
 - `teamIds: string[]`: List of teams to include. Leave empty to include all teams
 
**Returns**
 - `Promise<Article[]>`: Ten latest articles
 
 ## Examples
 
 ```javascript
 const shl = require("open-shl");
 let client = shl.connect({clientId: "", clientSecret:""});
 // Fetch the current standings
 client.season(2015).statistics.teams.standings()
    .then(teams => {
        console.log(teams[0].team_code, "is currently leading the SHL");
    });
    
 //Fetch the top hitters between FHC and FBK
 client.season(2015).statistics.players({sort: "hits", teamIds: ["FHC", "FBK"]})
    .then(players => {
        console.log("Between FBK and FHC, ", players[0].info.first_name, players[0].info.last_name, ", hits the most")
    });
 ```