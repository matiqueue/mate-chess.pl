import { Server as SocketIOServer, Socket } from "socket.io"
import { v4 as uuidv4 } from "uuid"

interface WaitingGame {
  gameId: string
  socket: Socket
}

let waitingOnlineGame: WaitingGame | null = null

// In‑memory store dla historii czatu, kluczem jest roomId
const chatHistory: { [roomId: string]: { sender: string; text: string }[] } = {}

export function initGameManager(io: SocketIOServer) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId)
      console.log(`Socket ${socket.id} joined room ${roomId}`)
      // Prześlij historię czatu do dołączającego użytkownika
      socket.emit("chatHistory", chatHistory[roomId] || [])
    })

    socket.on("sendMessage", (data: { roomId: string; message: { sender: string; text: string } }) => {
      const { roomId, message } = data
      // Zapisz wiadomość w historii czatu
      if (!chatHistory[roomId]) {
        chatHistory[roomId] = []
      }
      chatHistory[roomId].push(message)
      // Rozsyłamy wiadomość do wszystkich w pokoju
      io.to(roomId).emit("receiveMessage", message)
      console.log(`Message from ${socket.id} in room ${roomId}: ${message.text}`)
    })

    socket.on("startOnlineGame", () => {
      if (!waitingOnlineGame) {
        // Pierwszy gracz – ustaw oczekiwanie i dołącz do nowego pokoju
        const gameId = uuidv4()
        waitingOnlineGame = { gameId, socket }
        socket.join(gameId)
        console.log(`Player ${socket.id} is waiting in game ${gameId}`)
      } else {
        // Drugi gracz – dołącz do oczekującego pokoju
        const gameId = waitingOnlineGame.gameId
        socket.join(gameId)
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
