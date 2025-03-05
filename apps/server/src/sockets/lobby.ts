import { Server } from "socket.io"
import { lobbies } from "../index"
import chalk from "chalk"

export function setupSockets(io: Server) {
  io.on("connection", (socket) => {
    console.log(chalk.bgMagenta.white.bold(" [SOCKET] ") + chalk.magenta(` Klient połączony: ID=${socket.id} `))

    socket.on("joinLobby", (lobbyId) => {
      socket.join(lobbyId)
      const lobby = lobbies[lobbyId]
      if (lobby) {
        socket.emit("playerJoined", lobby.players)
        console.log(chalk.bgCyan.black.bold(" [SOCKET] ") + chalk.cyan(` Gracz dołączył do lobby: ID=${lobbyId} `))
      } else {
        console.log(chalk.bgYellow.black.bold(" [SOCKET] ") + chalk.yellow(` Lobby nie znaleziono: ID=${lobbyId} `))
      }
    })

    socket.on("sendMessage", (lobbyId, message) => {
      io.to(lobbyId).emit("newMessage", message)
      console.log(chalk.bgBlue.white.bold(" [SOCKET] ") + chalk.blue(` Wiadomość wysłana do lobby: ID=${lobbyId}, Treść="${message}" `))
    })

    socket.on("disconnect", () => {
      console.log(chalk.bgRed.white.bold(" [SOCKET] ") + chalk.red(` Klient rozłączony: ID=${socket.id} `))
    })
  })
}
