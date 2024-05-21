import { Socket } from 'socket.io'
import serverManager from '../managers/serverManager'
import { GameFinishReason } from '../../utils/types'


export const PlayerDisconnectHandler = (socket: Socket) => {
  console.log('[Debug]', socket.id, 'disconnected')

  const player = serverManager.getPlayerBySocketId(socket.id)

  if (!player) return

  if (player.getCurrentGame()) {
    // Player in game
    const game = player.getCurrentGame()
    const opposite = game?.getPlayers().find(d => d.player.getUserSocketId() !== player.getUserSocketId())

    game?.finish(opposite?.player || null, GameFinishReason.DISCONNECTED)
  }

  serverManager.removeUserBySocketId(socket.id)
}
