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

    // Pozwala dołączyć do pokoju, np. po przekierowaniu do /play/online/[id]
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId)
      console.log(`Socket ${socket.id} joined room ${roomId}`)
    })

    // Obsługa wysyłania wiadomości – przesyłamy je do wszystkich w pokoju
    socket.on("sendMessage", (data: { roomId: string; message: { sender: string; text: string } }) => {
      const { roomId, message } = data
      io.to(roomId).emit("receiveMessage", message)
      console.log(`Message from ${socket.id} in room ${roomId}: ${message.text}`)
    })

    // Obsługa rozgrywki online – matchmaking
    socket.on("startOnlineGame", () => {
      if (!waitingOnlineGame) {
        // Pierwszy gracz – ustaw oczekiwanie i dołącz do nowego pokoju
        const gameId = uuidv4()
        waitingOnlineGame = { gameId, socket }
        socket.join(gameId)
        console.log(`Player ${socket.id} is waiting in game ${gameId}`)
        // Klient pozostaje w lobby (strona /play/online)
      } else {
        // Drugi gracz – dołącz do oczekującego pokoju
        const gameId = waitingOnlineGame.gameId
        socket.join(gameId)
        // Powiadom wszystkich w pokoju, że gra się zaczyna
        io.to(gameId).emit("onlineGameStarted", { gameId })
        console.log(`Game started: ${gameId} with players ${waitingOnlineGame.socket.id} and ${socket.id}`)
        waitingOnlineGame = null
      }
    })

    socket.on("disconnect", () => {
      // Jeśli gracz oczekujący rozłączy się, czyścimy oczekującą grę.
      if (waitingOnlineGame && waitingOnlineGame.socket.id === socket.id) {
        console.log(`Waiting game disconnected: ${waitingOnlineGame.gameId}`)
        waitingOnlineGame = null
      }
    })
  })
}
