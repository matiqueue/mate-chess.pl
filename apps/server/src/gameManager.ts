import { Server as SocketIOServer, Socket } from "socket.io"
import { v4 as uuidv4 } from "uuid"

interface WaitingGame {
  gameId: string
  socket: Socket
}

let waitingOnlineGame: WaitingGame | null = null

export function initGameManager(io: SocketIOServer) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on("startOnlineGame", () => {
      if (!waitingOnlineGame) {
        // Pierwszy gracz: ustaw oczekiwanie i dołącz do pokoju o unikalnym gameId.
        const gameId = uuidv4()
        waitingOnlineGame = { gameId, socket }
        socket.join(gameId)
        console.log(`Player ${socket.id} is waiting in game ${gameId}`)
        // Nie wysyłamy jeszcze eventu – klient pozostaje w lobby.
      } else {
        // Drugi gracz: dołącz do oczekującego pokoju.
        const gameId = waitingOnlineGame.gameId
        socket.join(gameId)
        // Powiadom wszystkich w pokoju, że gra się zaczyna.
        io.to(gameId).emit("onlineGameStarted", { gameId })
        console.log(`Game started: ${gameId} with players ${waitingOnlineGame.socket.id} and ${socket.id}`)
        waitingOnlineGame = null
      }
    })

    socket.on("disconnect", () => {
      // Jeśli gracz oczekujący się rozłączy, czyścimy oczekującą grę.
      if (waitingOnlineGame && waitingOnlineGame.socket.id === socket.id) {
        console.log(`Waiting game disconnected: ${waitingOnlineGame.gameId}`)
        waitingOnlineGame = null
      }
    })
  })
}
