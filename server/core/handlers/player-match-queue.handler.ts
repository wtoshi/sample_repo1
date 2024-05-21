import { Socket } from 'socket.io'
import serverManager from '../managers/serverManager'
import { PlayerStatus } from '../../utils/types'

type ParamUser = {
  nickname: string
  action: 'enter' | 'leave'
}

export const PlayerMatchQueue = ( socket: Socket, user: ParamUser, callback: (error?: string) => void ) => {

  serverManager.updateUserStatus(
    user.nickname,
    user.action === 'enter' ? PlayerStatus.SEARCHING : PlayerStatus.AWAY
  )

  callback()
}
