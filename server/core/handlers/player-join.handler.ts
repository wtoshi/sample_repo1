import { Socket } from 'socket.io'


import { verify } from 'jsonwebtoken'

import { GameLanguages, Player as PlayerObject } from '../../utils/types'
import { config } from '../../config/token'
import serverManager from '../managers/serverManager'
import { Player } from '../../utils/classes/player'
import { convertLocaleToGameLanguage } from '../../utils/utils'


type ParamUser = {
  nickname: string
  avatar: string
  token: string
  language : string
}

export const PlayerJoinHandler = (
  socket: Socket,
  user: ParamUser,
  callback: (player?: PlayerObject, error?: string) => void ) => {

  try {
    if (!user.token) {
      callback(undefined, 'Invalid token!.')
      return
    }

    if (!user.avatar) {
      callback(undefined, 'Choose an avatar!.')
    }

    // Validate nickname
    const regex = /[^A-Za-z0-9_@]/g

    if (!user.nickname || user.nickname.length < 3) {
      callback(undefined, 'Your nickname must have at least 3 characters.')
      return
    }

    if (regex.test(user.nickname)) {
      callback(
        undefined,
        'Your nickname cannot contain special characters or spaces.'
      )
      return
    }

    if (user.nickname.length > 20) {
      callback(undefined, 'Your nickname must have a maximum of 20 characters.')
      return
    }

    const decoded = verify(user.token, config.secret)

    const { sub: tokenName } = decoded

    // if (tokenName !== user.nickname) {
    //   callback(undefined, 'Invalid token!')
    // }


    const player = new Player(
      user.nickname,
      socket.id,
      socket,
      user.token,
      user.avatar,
      convertLocaleToGameLanguage(user.language)
    )

    serverManager.addUser(player)

    callback(player.toObject())
  } catch (err: any) {
    callback(undefined, err.message)
  }
}
