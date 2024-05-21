// GAME
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

export type GameFinishPayload = {
  game: Game
  winner?: Player
  reason: GameFinishReason
}

export enum GameFinishReason {
  DISCONNECTED = 'disconnected',
  FORFEIT = 'forfeit',
  FINISHED = 'finished'
}

export type MatchObject = {
  playerWords: PlayerWords | []
};


export type PlayerWords = {
  [nickname: string]: { word: string; isCorrect: boolean }[];
}

export type LetterData = {
  middle : string
  others : string[]
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

export type TimerData = { nickname: string, duration: number }[]

// USER - PLAYER

export type CreateUserParams = {
    id: string
    nickname: string
    password?: string
    avatar: string
  }

  export type LogInUserParams = {
    nickname: string
    password?: string
  }

  export type UserParams = {
    nickname: string    
    avatar: string
    token: string
    score: number
    rank: number
  }

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

export type PlayerData = {
  playerObject: Player
  words: {word: string, isCorrect: boolean}[]
  letters : LetterData[]
  scoreInMatch: number
  duration: number
  hasTimerBonus: number
  addingMatchScore: number
  hasTimedOut: boolean
}

// LEADERBOARD
export type LeaderBoardPlayerItem = {
  place: number
  nickname: string
  avatar: string
  score: number
}