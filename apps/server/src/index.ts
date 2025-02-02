import { createServer } from "http"
import express from "express"
import { Server as SocketIOServer } from "socket.io"
import { initGameManager } from "./gameManager"

const app = express()
const httpServer = createServer(app)

// Konfiguracja Socket.IO z podstawową obsługą CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // W produkcji warto ograniczyć do konkretnych domen
    methods: ["GET", "POST"],
  },
})

// Middleware do obsługi JSON
app.use(express.json())

// Inicjujemy menedżera gry – tutaj zintegrowany z chess-engine
initGameManager(io)

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`)
})
