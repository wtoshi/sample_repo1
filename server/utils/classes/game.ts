import { v4 as uuid } from "uuid";
import { Player, PlayerInMatch } from "./player";
import {
  GameEvents,
  Game as GameObject,
  GameFinishPayload,
  GameFinishReason,
  GameStatus,
  LetterData,
  GameLanguages,
} from "../types";
import serverManager from "../../core/managers/serverManager";
import gameManager from "../../core/managers/gameManager";
import { MatchController } from "./match";
import { updatePlayer } from "../../controllers/gameController";

export class Game {
  private readonly id: string;
  private matchController: MatchController | null;
  private playersInMatch: PlayerInMatch[];
  private status: GameStatus;
  private duration: number;
  private playerTimers: { timer: NodeJS.Timer; player: PlayerInMatch }[];
  private checkingTimer: NodeJS.Timer | null = null;
  private initialLetters: LetterData | null;
  private gameLanguage: GameLanguages;

  constructor(playersInMatch: PlayerInMatch[], gameLanguage: GameLanguages) {
    this.id = uuid();
    this.playersInMatch = playersInMatch;
    this.status = GameStatus.WAITING;
    this.duration = 60;
    this.playerTimers = [];
    this.matchController = null;
    this.initialLetters = null;
    this.gameLanguage = gameLanguage;
  }

  public start() {
    // Start game
    console.log("[Debug] Game #", this.id, "started.");

    this.matchController = new MatchController(this.id);
    this.status = GameStatus.STARTED;

    const letterData = this.matchController.getLetterData(this.gameLanguage);
    this.initialLetters = { ...letterData }; // Copy initial letters including words

    this.setPlayerTimers();
    this.setCheckingTimer();

    this.playersInMatch.forEach((d) => {
      if (!d) {
        return;
      }

      if (!d.letters) {
        d.letters = [];
      }

      d.letters.push(letterData);
    });

    const data = this.toObject();

    serverManager
      .getConnection()
      ?.to(this.getId())
      .emit(GameEvents.ON_GAME_START, data);
  }

  public getTimerData() {
    type TimerData = { nickname: string; duration: number }[];

    const allTimers: TimerData = this.playersInMatch.map((data) => {
      return {
        nickname: data.player.getNickname(),
        duration: data.duration,
      };
    });

    return allTimers;
  }

  public getId() {
    return this.id;
  }

  public getGameLanguage() {
    return this.gameLanguage;
  }

  public getMatchController() {
    return this.matchController;
  }

  public getPlayers() {
    return this.playersInMatch;
  }

  public getPlayerInMatch(nickname: string) {
    const player = this.playersInMatch.find(
      (d) => d.player.getNickname() === nickname
    );

    if (!player) {
      console.error(`[Debug-${this.id}] Player not found.`);
      return;
    }

    return player;
  }

  public getPlayerCurrentLetterWords(nickname: string) {
    const player = this.playersInMatch.find(
      (d) => d.player.getNickname() === nickname
    );

    if (!player) return [];

    return player.letters[player.letters.length - 1].words;
  }

  public getStatus() {
    return this.status;
  }

  public getPlayerTimers() {
    return this.playerTimers;
  }

  public setPlayerTimers() {
    this.playersInMatch.forEach((player) => {
      player.duration = this.duration;

      const timer = setInterval(() => {
        player.duration = Math.max(player.duration - 1, 0);
        if (player.duration === 0 && !player.hasTimedOut) {
          player.hasTimedOut = true;
          console.log('player nickname timeout', player.player.getNickname())
          this.handlePlayerTimeout(player.player.getNickname());
        }
      }, 1000);

      this.playerTimers.push({ timer, player });
    });
  }

  private setCheckingTimer() {
    this.checkingTimer = setInterval(() => {
      serverManager
        .getConnection()
        ?.to(this.id)
        .emit(GameEvents.ON_SEND_TIMERS, this.getTimerData());
    }, 1000);
  }

  private handlePlayerTimeout(nickname: string) {
    const player = this.getPlayerInMatch(nickname);

    if (!player) return;

    // Oyuncunun zaman aşımına uğradığını bildir
    serverManager.getConnection()?.to(this.id)
      .emit(GameEvents.ON_PLAYER_TIMEOUT, {
        nickname: player.player.getNickname(),
        game: this.toObject()
      });

    const allTimedOut = this.playersInMatch.every((p) => p.hasTimedOut);

    if (allTimedOut) {
      const [player1, player2] = this.playersInMatch;

      if (player1.scoreInMatch !== player2.scoreInMatch) {
        const winner =
          player1.scoreInMatch > player2.scoreInMatch
            ? player1.player
            : player2.player;
        this.finish(winner, GameFinishReason.FINISHED);
      } else {
        this.finish(null, GameFinishReason.FINISHED);
      }
    }
  }

  public finish(winner: Player | null, reason: GameFinishReason) {
    console.log("[Debug] Game #", this.id, "finished.");
  
    if (this.checkingTimer) {
      clearInterval(this.checkingTimer as NodeJS.Timeout);
    }
    
    this.status = GameStatus.FINISHED;
  
    serverManager.getConnection()?.to(this.id)
      .emit(GameEvents.ON_GAME_FINISH, {
        winner: winner?.toObject(),
        game: this.toObject(),
        reason,
      } as GameFinishPayload);
  
    this.updatePlayerStats(winner);
  
    this.playersInMatch.forEach((data) => {      
      data.player.getConnection().leave(this.id);
      data.player.reset();
    });
  
    gameManager.destroyGame(this.id);
  }
  public toObject(): GameObject {
    return {
      id: this.id,
      players: this.playersInMatch.map((data) => {
        const playerData = data.player.toDataObject();

        playerData.letters = data.letters.map((letter) => {
          const { words, ...rest } = letter;
          return rest;
        });

        // Ekstra veriler
        return {
          ...playerData,
          scoreInMatch: data.scoreInMatch,
          duration: data.duration,
          hasTimerBonus: data.hasTimerBonus,
          addingMatchScore: data.addingMatchScore,
          hasTimedOut: data.hasTimedOut,
        };
      }),
      status: this.getStatus(),
    };
  }

  private async updatePlayerStats(winner: Player | null) {
    const promises = this.playersInMatch.map(async (playerInMatch) => {
      const player = playerInMatch.player;
      const isWinner = winner
        ? winner.getNickname() === player.getNickname()
        : false;

      try {
        await updatePlayer({
          nickname: player.getNickname(),
          isWinner,
          matchScore: playerInMatch.scoreInMatch,
        });
      } catch (err) {
        console.error(
          `Error updating stats for player ${player.getNickname()}:`,
          err
        );
      }
    });

    await Promise.all(promises);
  }
}
