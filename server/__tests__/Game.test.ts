import { Game } from "../utils/classes/game";
import { Player, PlayerInMatch } from "../utils/classes/player";
import { GameFinishReason, GameLanguages } from "../utils/types";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

describe("Game", () => {
  let game: Game;
  let player1: PlayerInMatch;
  let player2: PlayerInMatch;

  let mockServer: Server;
  let mockSocket1: Partial<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>;
  let mockSocket2: Partial<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>;

  beforeEach(() => {
    const httpServer = createServer();
    mockServer = new Server(httpServer);

    mockSocket1 = {
      id: "mockSocket1",
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      disconnected: false,
      handshake: {} as any,
      data: {},
      client: {} as any,
      join: jest.fn(),
      leave: jest.fn(),
    };

    mockSocket2 = {
      id: "mockSocket2",
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      disconnected: false,
      handshake: {} as any,
      data: {},
      client: {} as any,
      join: jest.fn(),
      leave: jest.fn(),
    };

    player1 = {
      player: new Player("testing1", "id1", mockSocket1 as Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 'token1', 'avatar1', GameLanguages.en),
      duration: 60,
      scoreInMatch: 0,
      hasTimerBonus: 0,
      hasTimedOut: false,
      letters: [],
      words: [],
      addingMatchScore: 0,
    };

    player2 = {
      player: new Player("testing2", "id2", mockSocket2 as Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 'token2', 'avatar2', GameLanguages.en),
      duration: 60,
      scoreInMatch: 0,
      hasTimerBonus: 0,
      hasTimedOut: false,
      letters: [],
      words: [],
      addingMatchScore: 0,
    };

    game = new Game([player1, player2], GameLanguages.en);
  });

  test("should start the game", () => {
    game.start();
    expect(game.getStatus()).toBe("started");
    expect(game.getPlayers()).toHaveLength(2);
  });

  test("should finish the game and determine winner", async () => {
    game.start();
    player1.scoreInMatch = 10;
    player2.scoreInMatch = 5;
    await game.finish(player1.player, GameFinishReason.FINISHED);
    expect(game.getStatus()).toBe("finished");
  }, 10000); // 10 saniye zaman aşımı
});
