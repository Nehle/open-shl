import { IShlConnection } from "./shl_connection";

type PlayerAttribute =
  | "assists"
  | "goals"
  | "points"
  | "pim"
  | "hits"
  | "plusminus";

type GoalkeeperAttribute =
  | "saves"
  | "savesPercent"
  | "goalsAgainst"
  | "goalsAgainstAverage"
  | "won"
  | "tied"
  | "lost"
  | "shooutOuts"
  | "minutesInPlay";

interface IShlQuery<TSort = void> {
  teamIds?: string[];
  sort?: TSort;
}

class ShlSeasonClient {
  private basePath: string;
  constructor(season: number, private connection: IShlConnection) {
    this.basePath = `/seasons/${season}`;
  }

  public games = (query: IShlQuery) =>
    this.connection.get(`${this.basePath}/games`, query);
  public statistics = {
    goalkeepers: (query: IShlQuery<GoalkeeperAttribute>) =>
      this.connection.get(`${this.basePath}/statistics/goalkeepers`, query),
    players: (query: IShlQuery<PlayerAttribute>) =>
      this.connection.get(`${this.basePath}/statistics/players`, query),
  };
  public teams = {
    standings: (query: IShlQuery) =>
      this.connection.get(`${this.basePath}/statistics/teams/standings`, query),
  };
}
export interface IShlSeasonClient {
  games(query: IShlQuery): Promise<IShlGame[]>;
  statistics: {
    goalkeepers(
      query: IShlQuery<GoalkeeperAttribute>
    ): Promise<GoalkeeperStatistics[]>;
    players(query: IShlQuery<PlayerAttribute>): Promise<PlayerStatistics[]>;
  };
  teams: {
    standings(query: IShlQuery): Promise<Team[]>;
  };
}
export interface IShlClient {}

export class ShlClient implements IShlClient {
  constructor(private connection: IShlConnecton) {
    this.connection.autoConnect = true;
  }

  public season(year: number) {
    return new ShlSeasonClient(year, this.connection);
  }

  public teams() {
    return this.connection.get("/teams");
  }

  public team(teamId: string) {
    return this.connection.get(`/teams/${teamId}`);
  }

  public videos(query: IShlQuery) {
    return this.connection.get("/videos", query);
  }

  public articles(query: IShlQuery) {
    return this.connection.get("/articles", query);
  }
}

module.exports = ShlClient;
