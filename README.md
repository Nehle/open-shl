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

All methods returns a promise that will resolve with a javascript object

#### client.season(season) 
`season`: An `integer` representing the year the season started
Returns the `season` object

#### season.games()

Fetches all games for that season

#### season.game(gameId) 
`gameId`
Fetch a single game with a given id


#### season.statistics.goalkeepers() 
Get stats for goalkeepers for a given season


#### season.statistics.players() 
Get statistics for all players

#### season.statistics.teams.standings() 
Get current standings for that season

#### client.teams()
Get a list of all teams

#### client.teams(teamCode) 
`teamCode`: is the three-character team code. i.e. "FHC" for Frölunda HC
Get details for a particular team.
 
#### client.videos() 
Get the ten latest videos
#### client.articles() 
Get the latest articles 
```