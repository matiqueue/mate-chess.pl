import { Server } from "socket.io" // Import serwera Socket.IO
import { lobbies } from "../index" // Import globalnego obiektu lobby
import chalk from "chalk" // Import biblioteki chalk do kolorowania logów

/**
 * setupSockets
 *
 * Inicjalizuje eventy Socket.IO dla połączeń z klientami.
 * Ustawia następujące eventy:
 * - "connection": loguje nowe połączenie i ustawia eventy dla danego socket:
 *   - "joinLobby": dodaje klienta do pokoju lobby i emituje event "playerJoined" z listą graczy.
 *   - "sendMessage": wysyła wiadomość do wszystkich klientów w danym lobby.
 *   - "disconnect": loguje rozłączenie klienta.
 *
 * @param {Server} io - Instancja serwera Socket.IO.
 *
 * @returns {void}
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export function setupSockets(io: Server): void {
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
