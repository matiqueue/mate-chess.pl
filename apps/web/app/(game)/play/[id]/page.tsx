"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { io, Socket } from "socket.io-client"

interface GameState {
  board: Array<{ index: number; figure: string | null }>
  currentPlayer: string
  moves: Array<{ player: string; from: number; to: number }>
  winner: string | null
}

interface PlayerMove {
  from: { row: number; col: number }
  to: { row: number; col: number }
  userName: string
}

let socket: Socket | null = null

export default function GameSessionPage() {
  const { id: sessionId } = useParams() as { id: string }
  const searchParams = useSearchParams()
  const host = (searchParams.get("host") as "server" | "player") || "server"
  const { user } = useUser()

  const [joined, setJoined] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [localBoard, setLocalBoard] = useState<string[][] | null>(null)
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Funkcja do tworzenia lokalnej planszy (dla host=player)
  function createLocalBoard(): string[][] {
    const board: string[][] = Array.from({ length: 8 }, () => Array(8).fill(null))
    // Przykładowe ustawienie jednej figury
    board[0][0] = "P" // Pawn na (0,0)
    return board
  }

  useEffect(() => {
    if (!user) return
    if (!sessionId) return

    if (!socket) {
      // Łączenie z serwerem Socket.io
      socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000")

      socket.on("connect", () => {
        console.log("Połączono z Socket.io:", socket?.id)
        // Dołącz do sesji
        socket?.emit("joinGame", {
          sessionId,
          userName: user.fullName || user.username || user.id,
        })
      })

      socket.on("joinError", (data) => {
        setError(data.error)
        alert("Błąd dołączania do sesji: " + data.error)
      })

      socket.on("sessionUpdate", (sessionData) => {
        console.log("Aktualizacja sesji:", sessionData)
        setJoined(true)
        // Możesz zaktualizować dodatkowe informacje o sesji
      })

      socket.on("boardUpdate", (state: GameState) => {
        console.log("Aktualizacja planszy (host=server):", state)
        setGameState(state)
      })

      socket.on("playerMove", (move: PlayerMove) => {
        console.log("Ruch gracza:", move)
        if (host === "player") {
          // Aktualizacja lokalnej planszy
          setLocalBoard((prev) => {
            if (!prev) return null
            const newBoard = structuredClone(prev)
            newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col]
            newBoard[move.from.row][move.from.col] = null
            return newBoard
          })
        }
      })

      socket.on("disconnect", () => {
        console.log("Rozłączono z Socket.io")
        setJoined(false)
      })
    }

    // Inicjalizacja lokalnej planszy, jeśli host=player
    if (host === "player") {
      setLocalBoard(createLocalBoard())
    }

    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [sessionId, user, host])

  // Funkcja obsługująca kliknięcie komórki planszy
  function handleCellClick(row: number, col: number) {
    if (!joined) return
    if (host === "server") {
      if (!gameState) return

      if (!selected) {
        // Zaznacz pole startowe
        setSelected({ row, col })
      } else {
        // Wykonaj ruch
        const fromIndex = selected.row * 8 + selected.col
        const toIndex = row * 8 + col
        socket?.emit("makeMove", {
          sessionId,
          userName: user?.fullName || user?.username || user?.id,
          from: fromIndex,
          to: toIndex,
        })
        setSelected(null)
      }
    } else if (host === "player") {
      if (!localBoard) return

      if (!selected) {
        setSelected({ row, col })
      } else {
        const piece = localBoard[selected.row][selected.col]
        if (!piece) {
          alert("Brak figury na wybranym polu.")
          setSelected(null)
          return
        }

        const newBoard = structuredClone(localBoard)
        newBoard[row][col] = piece
        newBoard[selected.row][selected.col] = null
        setLocalBoard(newBoard)

        // Wysłanie ruchu do serwera (forwardowanie)
        socket?.emit("makeMove", {
          sessionId,
          userName: user?.fullName || user?.username || user?.id,
          from: { row: selected.row, col: selected.col },
          to: { row, col },
        })
        setSelected(null)
      }
    }
  }

  // Renderowanie planszy
  function renderBoard() {
    if (host === "server") {
      if (!gameState) return <p>Ładowanie planszy...</p>
      const { board, currentPlayer, winner } = gameState

      const rows = []
      for (let r = 0; r < 8; r++) {
        const cols = []
        for (let c = 0; c < 8; c++) {
          const idx = r * 8 + c
          const pos = board[idx]
          const piece = pos.figure || ""

          cols.push(
            <td
              key={c}
              onClick={() => handleCellClick(r, c)}
              style={{
                width: 60,
                height: 60,
                border: "1px solid #333",
                background: (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              {piece}
            </td>,
          )
        }
        rows.push(<tr key={r}>{cols}</tr>)
      }

      return (
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>{rows}</tbody>
        </table>
      )
    } else if (host === "player") {
      if (!localBoard) return <p>Ładowanie lokalnej planszy...</p>

      const rows = localBoard.map((rowArr, r) => (
        <tr key={r}>
          {rowArr.map((val, c) => (
            <td
              key={c}
              onClick={() => handleCellClick(r, c)}
              style={{
                width: 60,
                height: 60,
                border: "1px solid #333",
                background: (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              {val || ""}
            </td>
          ))}
        </tr>
      ))

      return (
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>{rows}</tbody>
        </table>
      )
    }
  }

  if (!user) {
    return <div>Musisz być zalogowany, aby dołączyć do gry.</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>
        Sesja: {sessionId} (host={host})
      </h1>
      {!joined && <p>Dołączanie do sesji...</p>}
      {joined && (
        <>
          <p>Zalogowany jako: {user.fullName || user.username || "Nieznany użytkownik"}</p>
          {gameState && gameState.winner && <p style={{ color: "red" }}>Gra zakończona. Zwycięzca: {gameState.winner}</p>}
          {renderBoard()}
          {host === "server" && gameState && !gameState.winner && <p>Aktualny gracz: {gameState.currentPlayer}</p>}
        </>
      )}
      {error && <p style={{ color: "red" }}>Błąd: {error}</p>}
    </div>
  )
}
