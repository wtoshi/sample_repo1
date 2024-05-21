// GAME

import { PlayerData } from "../classes/player"

export type Game = {
  id: string
  match?: MatchObject
  status: GameStatus
  players: PlayerData[]
}

export enum GameStatus {
  WAITING = 'waiting',
  STARTED = 'started',
  FINISHED = 'finished'
}

export enum GameLanguages {
  en = 'English',
  tr = 'Turkish'  
}

export type MatchObject = {
  playerWords: PlayerWords | []
};


export type PlayerWords = {
  [nickname: string]: { word: string; isCorrect: boolean }[];
}

export type GameFinishPayload = {
  game: Game
  winner?: Player
  reason: GameFinishReason
}

export type LetterData = {
  middle : string
  others : string[]
  words? : string[]
}

export enum GameFinishReason {
  DISCONNECTED = 'disconnected',
  FORFEIT = 'forfeit',
  FINISHED = 'finished'
}

export enum rankTypes{
  Beginner  = 'Beginner',
  Novice  = 'Novice',
  Okay  = 'Okay',
  Good  = 'Good',
  Solid  = 'Solid',
  Nice  = 'Nice',
  Great  = 'Great',
  Amazing  = 'Amazing',
  Genius = 'Genius',
  Master = 'Master'
}

// PLAYER
export type Player = {
  id: string
  nickname: string
  avatar: string
  gamePlayed: number
  gameWon: number
  gameLost: number
  score: number
  rank: string
  token?: string
}

export enum PlayerStatus {
  IN_GAME = 'in_game',
  SEARCHING = 'searching',
  AWAY = 'away'
}

// LEADERBOARD
export type LeaderBoardPlayerItem = {
  place: number
  nickname: string
  avatar: string
  score: number
}

// API

export enum responseTypes{
    HasUser = 1,
    UserCreated = 2,
    UserNotFound = 3,
    PasswordWrong = 4,
    NicknameLength = 5
}

// EVENTS

export enum Events {
  ON_PLAYER_JOIN_LOBBY = 'join_lobby',
  ON_PLAYER_LEAVE_LOBBY = 'leave_lobby',
  ON_PLAYER_DISCONNECT = 'disconnect',
  ON_PLAYER_SEARCH_MATCH = 'search_match',
  ON_PLAYER_SEND_WORD = 'send_word',
  ON_PLAYER_SEND_CHANGE = 'send_change'
}

export enum GameEvents {
  ON_GAME_START = 'game_start',
  ON_MATCH_FIND = 'match_find',
  ON_GAME_FINISH = 'game_finish',

  ON_PLAYER_SEND_WORD = 'player_send_word',
  ON_PLAYER_TIMEOUT = 'player_timeout',
  ON_SEND_TIMERS = 'send_timers',

  ON_SEND_WORD_RESULT = 'send_word_result',
  ON_SEND_CHANGE_RESULT = 'send_change_result'
}
