import { Server } from "socket.io"
import { lobbies } from "../index"

export function setupSockets(io: Server) {
  io.on("connection", (socket) => {
    console.log(`[SOCKET] Klient połączony: ID=${socket.id}`)

    socket.on("joinLobby", (lobbyId) => {
      socket.join(lobbyId)
      const lobby = lobbies[lobbyId]
      if (lobby) {
        socket.emit("playerJoined", lobby.players)
        console.log(`[SOCKET] Gracz dołączył do lobby: ID=${lobbyId}`)
      } else {
        console.log(`[SOCKET] Lobby nie znaleziono: ID=${lobbyId}`)
      }
    })

    socket.on("sendMessage", (lobbyId, message) => {
      io.to(lobbyId).emit("newMessage", message)
      console.log(`[SOCKET] Wiadomość wysłana do lobby: ID=${lobbyId}, Treść="${message}"`)
    })

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Klient rozłączony: ID=${socket.id}`)
    })
  })
}
