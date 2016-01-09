#open-shl

Node.js client for the open SHL (Swedish Hockey League) API. Developed with and for node.js 5+

## Install

`npm install --save open-shl`

## Usage

First make sure you have a valid `clientId` and `clientSecret` for the API, which can be gained by emailing support@shl.se

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

#### `client.season(season)`
**Parameters** 
 - `season: int`: The year the season started

**Returns**
 - `season`: The `season` API object

#### `season.games()`
Fetches all games for the season

**Returns**
 - `Promise<Game[]>`: Promise of all games for the season

#### `season.game(gameId)`
Fetches a specific games

**Parameters**
 - `gameId: int`: Id for the game to fetch

**Returns**
 - `Promise<Game>`: The game with the specified id


#### `season.statistics.goalkeepers()`
Gets the top goalkeepers for the season

**Parameters**
 - `gameId: int`:
 
**Returns**
 - `Promise<GoalkeeperStatistics[]>`: Statistics for all goalkeepers during that season 

#### `season.statistics.players()`
Gets the top players for the season

**Returns**
 - `Promise<PlayerStatistics[]>`: Statistics for top players during that season 

#### `season.statistics.teams.standings()`
Get current standings for that season

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
 
#### `client.videos()`
Get the ten latest videos

**Returns**
 - `Promise<Video[]>`: Ten latest videos
 
#### `client.articles()`
Get the latest articles 

**Returns**
 - `Promise<Article[]>`: Ten latest articles