import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import linkRouter from "./api/link"
import onlineRouter from "./api/online"
import { setupSockets } from "./sockets/lobby"
import { Lobby } from "./types"

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

export const lobbies: { [key: string]: Lobby } = {}

app.use(cors())
app.use(express.json())

app.use("/api", linkRouter)
app.use("/api", onlineRouter)

setupSockets(io)

server.listen(4000, () => {
  console.log("[SERVER] Serwer uruchomiony na porcie 4000")
})
