"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:4000")

export default function OnlineLobby() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get("lobbyId")
  const [lobby, setLobby] = useState<Player[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (!lobbyId || !user) return

    socket.emit("joinLobby", lobbyId)
    socket.on("playerJoined", (players) => {
      console.log("[FRONT] Zaktualizowano listę graczy:", players)
      setLobby(players)
    })
    socket.on("countdown", (count) => {
      console.log("[FRONT] Odliczanie:", count)
      setCountdown(count)
    })
    socket.on("gameStarted", (gameUrl) => {
      console.log("[FRONT] Gra rozpoczęta, przekierowanie do:", gameUrl)
      router.push(gameUrl)
    })

    return () => {
      socket.off("playerJoined")
      socket.off("countdown")
      socket.off("gameStarted")
    }
  }, [lobbyId, user, router])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Lobby Online</h1>
      <div className="my-4">
        {lobby.map((player) => (
          <div key={player.id} className="flex items-center my-2">
            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full mr-2" />
            <span>{player.name}</span>
          </div>
        ))}
      </div>
      {countdown !== null && <p className="mt-2">Start za {countdown}...</p>}
    </div>
  )
}

interface Player {
  id: string
  name: string
  avatar: string
  isGuest: boolean
}
