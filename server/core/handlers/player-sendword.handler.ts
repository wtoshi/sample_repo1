/* eslint-disable n/no-callback-literal */
import { Socket } from 'socket.io'
import serverManager from '../managers/serverManager'
import { Game } from '../../utils/types'

type ParamPlay = {
  nickname: string
  token: string
  word: string
}

export const PlayerSendWordHandler = ( socket: Socket, data: ParamPlay, callback: (error: string) => void ) => {
  try {
    if (!data.token) {
      callback('Invalid token!')
      return
    }

    const findPlayerByToken = serverManager.getUsers().find(
      usr => usr.getToken() === data.token
    )

    if (!findPlayerByToken) {
      callback('Player not found!')
    }

    if (findPlayerByToken?.getNickname() !== data.nickname) {
      callback('Invalid nickname!')
    }

    const game = findPlayerByToken?.getCurrentGame()

    if (!game) {
      callback('Player not in game!')
    }

    console.log('PlayerSendWordHandler', data)
    
    game?.getMatchController()?.handleNewWord(data.nickname, data.token, data.word,callback)
  } catch (err: any) {
    callback(err.message)
  }
}
