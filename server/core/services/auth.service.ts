import { sign } from 'jsonwebtoken'
import { responseTypes } from '../../utils/types'
import { createError } from '../../middlewares/errorHandling'
import serverManager from '../managers/serverManager'
import { config } from '../../config/token'


type IRequest = {
  name: string
}

type IResponse = {
  token: string
}

class LobbyAuthService {
  public async execute({ name }: IRequest): Promise<IResponse> {
    // Connected and authenticated users
    const players = serverManager.getUsers()

    const existsPlayerWithSameName = players.find(
      p => p.getNickname().toLocaleLowerCase() === name.toLocaleLowerCase()
    )

    if (existsPlayerWithSameName) {
      createError(400, responseTypes.HasUser.toLocaleString())
    }

    // Generate jwt token
    const token = sign({}, config.secret, {
      subject: name,
      expiresIn: config.expiresIn
    })

    return { token }
  }
}

export default new LobbyAuthService()
