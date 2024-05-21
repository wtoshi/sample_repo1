import { Socket } from 'socket.io'
import serverManager from '../managers/serverManager'

type ParamUser = {
  nickname: string
}

export const PlayerQuitHandler = (socket: Socket, user: ParamUser) => {
  serverManager.removeUserByNickname(user.nickname)
}
