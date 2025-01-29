import express, { Request, Response, NextFunction } from "express"
import { Server } from "socket.io"
import { createNewGame, ChessEngine } from "@workspace/chess-engine/index"
import cors from "cors"

// Definicja interfejsu sesji gry
interface GameSession {
  id: string
  host: "server" | "player"
  players: string[]
  engine: ChessEngine | null
}

const sessions = new Map<string, GameSession>()

const app = express()

// Konfiguracja CORS
const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:3000", // Adres Twojej aplikacji Next.js
  methods: ["GET", "POST"],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

// Inicjalizacja serwera Express
const PORT = 4000
const server = app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na http://localhost:${PORT}`)
})

// Inicjalizacja Socket.IO z użyciem serwera Express
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("Nowy klient:", socket.id)

  // Klient wysyła: joinGame z { sessionId, userName }
  socket.on("joinGame", ({ sessionId, userName }) => {
    const session = sessions.get(sessionId)
    if (!session) {
      console.log(`Brak sesji ${sessionId}`)
      socket.emit("joinError", { error: "Session not found" })
      return
    }

    // Sprawdź, czy już 2 graczy w sesji
    if (session.players.length >= 2) {
      socket.emit("joinError", { error: "Session full" })
      return
    }

    // Dodaj gracza
    session.players.push(userName)
    sessions.set(sessionId, session)

    socket.join(sessionId)
    console.log(`${userName} dołączył do sesji ${sessionId}`)

    // Odeslij info o aktualnym stanie
    io.to(sessionId).emit("sessionUpdate", {
      sessionId,
      players: session.players,
      host: session.host,
    })

    // Jeśli host to server i to pierwszy gracz, możesz dodatkowo zainicjalizować grę
    if (session.host === "server" && session.players.length === 1 && session.engine) {
      // Możesz tutaj wywołać dodatkowe metody na engine, jeśli potrzebujesz
      // np. session.engine.startGame()
      console.log(`Engine rozpoczął grę w sesji ${sessionId}`)
      io.to(sessionId).emit("boardUpdate", session.engine.getGameState())
    }
  })

  // Klient wysyła: makeMove -> { sessionId, userName, from, to }
  socket.on("makeMove", ({ sessionId, userName, from, to }) => {
    const session = sessions.get(sessionId)
    if (!session) {
      socket.emit("moveError", { error: "No such session" })
      return
    }

    // Sprawdź, czy userName faktycznie jest w tej sesji
    if (!session.players.includes(userName)) {
      socket.emit("moveError", { error: "You are not in this session" })
      return
    }

    // 1) Host=server: logika ruchu jest po stronie serwera
    if (session.host === "server" && session.engine) {
      try {
        session.engine.playMove(from, to)
        // Rozsyłamy aktualny stan do wszystkich
        const state = session.engine.getGameState()
        io.to(sessionId).emit("boardUpdate", state)
      } catch (err: any) {
        socket.emit("moveError", { error: err.message })
      }
    }

    // 2) Host=player: serwer tylko forwarduje info do roomu (broadcast)
    else if (session.host === "player") {
      // Przy host=player, 'from' i 'to' są obiektami z {row, col}
      socket.to(sessionId).emit("playerMove", { from, to, userName })
    }
  })

  socket.on("disconnect", () => {
    console.log("Klient rozłączony:", socket.id)
    // Możesz tutaj obsłużyć usuwanie gracza z sesji, jeśli chcesz
  })
})

// Typowanie interfejsów dla żądań
interface CreateSessionBody {
  host: "server" | "player"
}

interface CreateSessionQuery {
  host?: "server" | "player"
}

// Handler POST /create-session
app.post("/create-session", (req: Request<{}, {}, CreateSessionBody>, res: any) => {
  const { host } = req.body

  // Walidacja hosta
  if (host !== "server" && host !== "player") {
    return res.status(400).json({ error: "Invalid host type" })
  }

  // Generujemy 8 znaków
  const sessionId = Math.random().toString(36).slice(2, 10).toUpperCase()

  let engine: ChessEngine | null = null
  if (host === "server") {
    engine = createNewGame()
  }

  sessions.set(sessionId, {
    id: sessionId,
    host,
    players: [],
    engine,
  })

  console.log(`Utworzono sesję ${sessionId} (host=${host})`)
  res.json({ sessionId, host })
})

// Handler GET /create-session
app.get("/create-session", (req: Request<{}, {}, {}, CreateSessionQuery>, res: Response, next: NextFunction) => {
  const queryHost = req.query.host
  let host: "server" | "player" = "server"
  if (queryHost === "player") {
    host = "player"
  }

  const sessionId = Math.random().toString(36).slice(2, 10).toUpperCase()
  let engine: ChessEngine | null = null
  if (host === "server") {
    engine = createNewGame()
  }

  sessions.set(sessionId, {
    id: sessionId,
    host,
    players: [],
    engine,
  })

  console.log(`(GET) Utworzono sesję ${sessionId} (host=${host})`)
  res.json({ sessionId, host })
})

// Endpoint testowy
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from Socket.IO server!")
})

// Middleware do obsługi błędów
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send("Coś poszło nie tak!")
})
