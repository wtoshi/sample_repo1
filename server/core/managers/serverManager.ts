/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from "express";
import { Server, Socket } from "socket.io";
import http = require("http");
import gameMatchJob from "../../utils/jobs/gameMatch.job";
import { Events, PlayerStatus } from "../../utils/types";
import { Player } from "../../utils/classes/player";
import dotenv from "dotenv";

dotenv.config();
type Listener = {
  event: Events | Event;
  handler: (socket: Socket, ...params: any) => void;
};

class ServerManager {
  private users: Player[] = [];
  private readonly listeners: Listener[] = [];
  private connection: Server | undefined;

  public init(app: Express) {
    const server = http.createServer(app);

    this.connection = new Server(server, {
      cors: {
        origin: "*", // İzin verilen origin
        methods: ["GET", "POST"],
        // credentials: true, // Credentials'ı kabul et
      },
    });

    this.registerListeners();
    this.runjobs();

    const port = process.env.PORT || 5000;

    server.listen(port, () => {
      console.log(`[Server] Listening on ${port}`);
    });
  }

  public registerListener(event: Events | Event, handler: Listener["handler"]) {
    console.log("[Debug] Registering listener for", event);
    this.listeners.push({ event, handler });
  }

  public getConnection(): Server | undefined {
    return this.connection;
  }

  private runjobs() {
    gameMatchJob.execute();
  }

  private registerListeners() {
    this.connection?.on("connection", (socket) => {
      console.log("[Debug] #", socket.id, "connected");

      this.listeners.forEach((listener) => {
        socket.on(listener.event as string, (...args) => {
          console.log("[Debug]", listener.event, "event received");
          listener.handler(socket, ...args);
        });
      });
    });
  }

  public removeUserBySocketId(id: string) {
    const user = this.users.find((usr) => usr.getUserSocketId() === id);

    if (!user) return;

    this.users = this.users.filter((usr) => usr.getUserSocketId() !== id);

    console.log("[Debug]", user.getNickname(), "left the lobby");
  }

  public removeUserByNickname(nickname: string) {
    const user = this.users.find((usr) => usr.getNickname() === nickname);

    if (!user) return;

    this.users = this.users.filter((usr) => usr.getNickname() !== nickname);

    console.log("[Debug]", user.getNickname(), "left the lobby");
  }

  public getUsers() {
    return this.users;
  }

  public getPlayerBySocketId(socketId: string) {
    return this.users.find((usr) => usr.getUserSocketId() === socketId);
  }

  public updateUserStatus(nickname: string, status: PlayerStatus) {
    const index = this.users.findIndex((usr) => usr.getNickname() === nickname);
    const user = this.users.find((usr) => usr.getNickname() === nickname);

    if (index === -1 || !user) return;

    user.setStatus(status);

    this.users[index] = user;

    console.log("[Debug] Status of", user.getNickname(), "changed to", status);
  }

  public addUser(user: Player) {
    if (this.users.find((usr) => usr.getNickname() === user.getNickname())) {
      throw new Error("There is already a player with that nickname online");
    }

    this.users.push(user);

    console.log("[Debug]", user.getNickname(), "joined in the lobby");
  }
}

export default new ServerManager();
