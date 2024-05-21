import { Player, PlayerInMatch } from "../../utils/classes/player";
import { Game } from "../../utils/classes/game";
import { GameEvents, GameLanguages, PlayerStatus } from "../../utils/types";
import serverManager from "./serverManager";

class GameManager {
  private games: Game[] = [];

  public async createGame(playersInMatch: PlayerInMatch[] , gameLanguage : GameLanguages) {
    const game = new Game(playersInMatch,gameLanguage);

    game.getPlayers().forEach(async (d, index) => {
      // Update players statuses
      d.player.setStatus(PlayerStatus.IN_GAME);

      d.player.setCurrentGame(game.getId());

      // Join on game room
      await d.player.getConnection().join(game.getId());
    });

    serverManager
      .getConnection()
      ?.to(game.getId())
      .emit(GameEvents.ON_MATCH_FIND, game.toObject());

    this.games.push(game);

    console.log("[Debug] Game #", game.getId(), "created.", game.getPlayers());

    setTimeout(() => {
      game.start();
    }, 6000);
  }

  public destroyGame(id: string) {
    this.games = this.games.filter((game) => game.getId() !== id);

    console.log("[Debug] Game #", id, "destroyed.");
  }

  public getAllGames() {
    return this.games;
  }
}

export default new GameManager();
