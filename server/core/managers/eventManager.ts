import serverManager from './serverManager'
import { Events } from '../../utils/types'
import { PlayerJoinHandler } from '../handlers/player-join.handler'
import { PlayerQuitHandler } from '../handlers/player-quit.handler'
import { PlayerMatchQueue } from '../handlers/player-match-queue.handler'
import { PlayerDisconnectHandler } from '../handlers/player-disconnect.handler'
import { PlayerSendWordHandler } from '../handlers/player-sendword.handler'
import { PlayerSendChangeLetterHandler } from '../handlers/player-change-letter.handler'

class EventManager {
  public registerHandlers() {
    // Register all event handlers
    serverManager.registerListener( Events.ON_PLAYER_JOIN_LOBBY, PlayerJoinHandler )
    serverManager.registerListener( Events.ON_PLAYER_LEAVE_LOBBY, PlayerQuitHandler )
    serverManager.registerListener( Events.ON_PLAYER_SEARCH_MATCH, PlayerMatchQueue )
    serverManager.registerListener( Events.ON_PLAYER_DISCONNECT, PlayerDisconnectHandler )
    serverManager.registerListener(Events.ON_PLAYER_SEND_WORD, PlayerSendWordHandler)
    serverManager.registerListener(Events.ON_PLAYER_SEND_CHANGE, PlayerSendChangeLetterHandler)
  }
}

export default new EventManager()
