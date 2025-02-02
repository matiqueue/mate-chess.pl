import { Server as SocketIOServer } from "socket.io"
// Importujemy naszą klasę z chess-engine, która zostanie opakowana w nowy moduł
import { ChessGame } from "@workspace/chess-engine/functions"

export function initGameManager(io: SocketIOServer) {
  io.on("connection", (socket) => {
    console.log(`Nowy klient: ${socket.id}`)

    // Inicjujemy nową grę lub ładujemy istniejącą
    const game = new ChessGame()

    // Wysyłamy aktualny stan gry do klienta
    socket.emit("gameState", game.getState())

    // Obsługa ruchu przesłanego przez klienta
    socket.on("move", (moveData) => {
      try {
        const result = game.makeMove(moveData.from, moveData.to)
        if (result.success) {
          // Rozsyłamy zaktualizowany stan gry do wszystkich klientów (lub do konkretnej "pokoju" gry)
          io.emit("gameState", game.getState())
        } else {
          socket.emit("error", result.error)
        }
      } catch (error) {
        socket.emit("error", "Wystąpił błąd podczas wykonywania ruchu.")
      }
    })
  })
}
