import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import linkRouter from "./api/link"
import onlineRouter from "./api/online"
import { setupSockets } from "./sockets/lobby"
import { Lobby } from "./types"
import chalk from "chalk"

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true, // Dodaj, jeśli używasz ciasteczek lub autoryzacji
  },
})

export const lobbies: { [key: string]: Lobby } = {}

// Tablica przechowująca logi (max 200)
const serverLogs: string[] = []
const MAX_LOGS = 200

// Namespace dla logów admina
const adminLogsNamespace = io.of("/admin-logs")

// Funkcja usuwająca kody ANSI
const stripAnsi = (str: string): string => {
  return str.replace(/\x1B\[[0-9;]*[mK]/g, "")
}

// Nadpisz console.log
const originalConsoleLog = console.log
console.log = function (...args: any[]) {
  const message = args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg))).join(" ")
  originalConsoleLog(message)
  const cleanMessage = stripAnsi(message)
  if (serverLogs.length >= MAX_LOGS) {
    serverLogs.shift()
  }
  serverLogs.push(cleanMessage)
  adminLogsNamespace.emit("log", cleanMessage)
}

// Połączenie admina - wyślij wszystkie dotychczasowe logi
adminLogsNamespace.on("connection", (socket) => {
  originalConsoleLog(chalk.bgYellow.black.bold(" [ADMIN] ") + chalk.yellow(" Admin podłączony do logów "))
  socket.emit("initial_logs", serverLogs)
  socket.on("disconnect", () => {
    originalConsoleLog(chalk.bgYellow.black.bold(" [ADMIN] ") + chalk.yellow(" Admin odłączony "))
  })
})

app.use(cors())
app.use(express.json())

app.use("/api", linkRouter)
app.use("/api", onlineRouter)

setupSockets(io)

server.listen(4000, () => {
  console.log(chalk.bgGreen.black.bold(" [SERVER] ") + chalk.green(" Serwer uruchomiony na porcie 4000 "))
})
