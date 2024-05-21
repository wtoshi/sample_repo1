import { Socket } from 'socket.io'
import { PlayerStatus,Player as PlayerObject, rankTypes, LetterData, GameLanguages } from '../types'
import gameManager from '../../core/managers/gameManager'

export type PlayerInMatch = {
  player: Player
  words: {word: string, isCorrect: boolean}[]  
  letters : LetterData[],
  scoreInMatch: number
  duration: number
  hasTimerBonus: number
  addingMatchScore: number
  hasTimedOut: boolean
}

export type PlayerData = {
  playerObject: PlayerObject
  words: {word: string, isCorrect: boolean}[]
  letters : LetterData[]
  scoreInMatch: number
  duration: number
  hasTimerBonus: number
  addingMatchScore: number
  hasTimedOut: boolean
}

export class Player {
  private readonly id: string
  private readonly nickname: string
  private readonly avatar: string
  private readonly connection: Socket
  private readonly token: string
  private gamePlayed: number
  private gameWon: number
  private gameLost: number
  private score: number
  private rank: string
  private status: PlayerStatus
  private currentLanguage : GameLanguages
  private canPlay: boolean
  private currentGameId: string | null

  constructor(
    nickname: string,
    id: string,
    connection: Socket,
    token: string,
    avatar: string,
    currentLanguage: GameLanguages
  ) {
    this.id = id
    this.nickname = nickname
    this.avatar = avatar
    this.connection = connection
    this.token = token
    this.currentLanguage = currentLanguage

    this.gamePlayed = 0
    this.gameWon = 0
    this.gameLost = 0
    this.score = 0
    this.rank = rankTypes.Beginner.toString()

    this.status = PlayerStatus.AWAY
    this.canPlay = false
    this.currentGameId = null
  }

  public canUserPlay() {
    return this.canPlay
  }

  public getUserSocketId() {
    /** Return user socket connection id */
    return this.id
  }

  public getPlayerLang(){
    return this.currentLanguage
  }

  public getCurrentGame() {
    return gameManager.getAllGames().find(
      game => game.getId() === this.currentGameId
    )
  }

  public reset() {
    // Reset player
    this.currentGameId = null
    this.status = PlayerStatus.AWAY
    this.canPlay = false
  }

  public setCurrentGame(gameId: string) {
    this.currentGameId = gameId
  }

  public getStatus() {
    return this.status
  }

  public setStatus(status: PlayerStatus) {
    this.status = status
  }

  public getConnection() {
    return this.connection
  }

  public getToken() {
    return this.token
  }

  public getNickname() {
    return this.nickname
  }

  public getAvatar() {
    return this.avatar
  }

  public toObject(): PlayerObject {
    return {
      id: this.id,
      nickname: this.nickname,
      avatar: this.avatar,
      gamePlayed: this.gamePlayed,
      gameWon: this.gameWon,
      gameLost: this.gameLost,
      score: this.score,
      rank: this.rank,
      token: '',      
    }
  }

  // server kullanımı için
  public toInMatchPlayer() : PlayerInMatch {
    return {
      player: this,
      words: [],
      letters : [],
      scoreInMatch: 0,
      addingMatchScore: 0,
      duration: 0,
      hasTimerBonus: 0,
      hasTimedOut: false
    }
  }

  // data transferi için
  public toDataObject() : PlayerData {
    return {
      playerObject: this.toObject(),
      words: [],
      letters : [],
      scoreInMatch: 0,
      duration: 0,
      hasTimerBonus: 0,
      addingMatchScore: 0,
      hasTimedOut: false
    }
  }
}
