import { createServer } from "http"
import express from "express"
import { Server as SocketIOServer } from "socket.io"
import { initGameManager } from "./gameManager"

const app = express()
const httpServer = createServer(app)

// Konfiguracja Socket.IO z CORS (dla testu otwarte połączenia)
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
})

app.use(express.json())

initGameManager(io)

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
