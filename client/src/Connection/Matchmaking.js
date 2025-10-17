class Match {
  constructor(player1, player2, gameId) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameId = gameId;
  }
}

export class MatchmakingInterface {
  constructor() {
    this.currentMatches = [];
  }

  matchPlayers(Player1, Player2) {
    const gameId = crypto.randomUUID();
    const match = new Match(Player1, Player2, gameId);
    console.log(
      `Matched players ${Player1.username} and ${Player2.username} in game ${gameId}`
    );
    this.currentMatches.push(match);
  }
}
