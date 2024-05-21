import cron = require('node-cron');
import serverManager from '../../core/managers/serverManager';
import gameManager from '../../core/managers/gameManager';
import { GameLanguages, PlayerStatus } from '../types';
import { Player } from '../classes/player';

class GameMatchJob {
  public execute() {
    cron.schedule('*/5 * * * * *', () => {
      const searchingPlayers = serverManager.getUsers().filter(
        usr => usr.getStatus() === PlayerStatus.SEARCHING
      );

      console.log('[Debug] Searching players:', searchingPlayers.length);

      if (searchingPlayers.length < 2) return;

      // Oyuncuları dil tercihine göre gruplandır
      const playersByLanguage = this.groupPlayersByLanguage(searchingPlayers);

      // Her dil grubu için eşleştirme yap
      for (const [language, players] of Object.entries(playersByLanguage)) {
        while (players.length >= 2) {
          const player1 = players.shift()!.toInMatchPlayer();
          const player2 = players.shift()!.toInMatchPlayer();

          gameManager.createGame([player1, player2], language as GameLanguages);
        }
      }
    });
  }

  private groupPlayersByLanguage(players: Player[]): { [language in GameLanguages]?: Player[] } {
    return players.reduce((acc, player) => {
      const language = player.getPlayerLang();
      if (!acc[language]) {
        acc[language] = [];
      }
      (acc[language] as Player[]).push(player); 
      return acc;
    }, {} as { [language in GameLanguages]?: Player[] });
  }
}

export default new GameMatchJob();
