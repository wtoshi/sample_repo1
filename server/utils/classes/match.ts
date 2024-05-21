import gameManager from "../../core/managers/gameManager";
import serverManager from "../../core/managers/serverManager";
import {
  Game,
  GameEvents,
  LetterData,
  MatchObject,
  PlayerWords,
} from "../types";

import fs from "fs";
import path from "path";
import { PlayerInMatch } from "./player";

export class MatchController {
  private readonly gameId: string;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public handleChangeLetterRequest(nickname: string, playerToken: string) {

    const game = gameManager.getAllGames().find((g) => g.getId() === this.gameId);

    if (!game) {
      console.log(`[Debug-${this.gameId}] ERROR Game not found.`);

      throw new Error("Game not found");
    }

    let playerInMatch = game.getPlayerInMatch(nickname);
    if (!playerInMatch) throw new Error("Player not found in match.");

    let letterData = this.getLetterData(game.getGameLanguage());

    playerInMatch.letters.push(letterData);

    console.log(`[Debug-${this.gameId}] Letter changed for player ${nickname}.`);
    
    serverManager.getConnection()?.to(this.gameId)
    .emit(GameEvents.ON_SEND_CHANGE_RESULT, {
        game: game.toObject()
      });
  }

  public handleNewWord(
    nickname: string,
    playerToken: string,
    word: string,
    callback: (error: string) => void
  ) {
    const game = gameManager
      .getAllGames()
      .find((g) => g.getId() === this.gameId);

    if (!game) {
      console.log(`[Debug-${this.gameId}] ERROR Game not found.`);

      throw new Error("Game not found");
    }

    let playerInMatch = game.getPlayerInMatch(nickname);
    if (!playerInMatch) throw new Error("Player not found in match.");

    let error = this.checkWordHasError(nickname, word);

    // Hata varsa geri dön
    if (error) {
      callback(error);

      return;
    }

    let isCorrect = this.checkWordIsCorrect(nickname, word);

    let index = 0;

    if (isCorrect) {
      playerInMatch.words.unshift({ word, isCorrect: true });
      index = 0;
    } else {
      playerInMatch.words.push({ word, isCorrect: false });
      index = playerInMatch.words.length - 1;
    }

    if (isCorrect) {
      const score = this.calculateScoreByLenght(word);

      playerInMatch.scoreInMatch += score;
      playerInMatch.hasTimerBonus = 15;

      playerInMatch.duration += 15;
      playerInMatch.hasTimedOut = false;
      playerInMatch.addingMatchScore = score;
    }

    console.log(
      `[Debug-${this.gameId}] Word added to player ${nickname} : ${word} - ${
        isCorrect ? "Correct" : "Incorrect"
      }`
    );

    serverManager .getConnection() ?.to(this.gameId)
      .emit(GameEvents.ON_SEND_WORD_RESULT, {
        game: game.toObject(),
        nickname,
        word,
        index,
        isCorrect,
      });

      console.log(`[Debug-${this.gameId}] Game data: ${JSON.stringify(game.toObject())}`)

      playerInMatch.addingMatchScore = 0;
      playerInMatch.hasTimerBonus = 0;
  }

  private checkWordHasError(nickname: string, word: string) {
    const game = gameManager
      .getAllGames()
      .find((g) => g.getId() === this.gameId);

    if (word.length < 4) {
      return "Word must be at least 4 characters.";
    }

    let playerInMatch = game?.getPlayerInMatch(nickname);
    if (playerInMatch?.words.find((w) => w.word === word)) {
      return "Word already used.";
    }

    return null;
  }

  private checkWordIsCorrect(nickname: string, word: string) {
    const game = gameManager
      .getAllGames()
      .find((g) => g.getId() === this.gameId);

    if (!game) {
      console.error(`[Debug-${this.gameId}] Game not found.`);
      return false;
    }

    const words = game.getPlayerCurrentLetterWords(nickname);

    if (!words) {
      console.error(
        `[Debug-${this.gameId}] No words found for player ${nickname}.`
      );
      return false;
    }

    console.log(
      `[Debug-${
        this.gameId
      }] Checking word ${word.toLowerCase()} for player ${nickname} in ${words.map(
        (w) => w.toLowerCase()
      )}`
    );

    return words.map((w) => w.toLowerCase()).includes(word.toLowerCase());
  }

  private calculateScoreByLenght(word: string) {
    let baseScore = 10; // Taban puan
    let lengthBonus = (word.length - 4) * 2; // Her fazla harf için bonus

    return baseScore + lengthBonus;
  }

  public getLetterData(language: string): LetterData {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      `${language.toLowerCase()}_game_data.json`
    );
    const gameData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const randomIndex = Math.floor(Math.random() * gameData.length);
    const { middle, letters, words } = gameData[randomIndex];

    return {
      middle,
      others: letters,
      words: words,
    };
  }

  // public toObject(): MatchObject {
  //   return {

  //   };
  // }
}
