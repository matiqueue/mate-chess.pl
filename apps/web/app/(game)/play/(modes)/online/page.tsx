"use client"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useRouter } from "next/navigation"

export default function OnlineLobby() {
  const router = useRouter()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Inicjujemy połączenie tylko raz
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000")
    }
    // Emitujemy event, gdy gracz wchodzi do lobby
    socketRef.current.emit("startOnlineGame")

    // Nasłuchujemy eventu, który informuje o starcie gry
    socketRef.current.on("onlineGameStarted", (data: { gameId: string }) => {
      router.push(`/play/online/${data.gameId}`)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Oczekiwanie na drugiego gracza...</h1>
    </div>
  )
}
