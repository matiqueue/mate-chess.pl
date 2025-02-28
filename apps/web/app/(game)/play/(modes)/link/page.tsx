"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:4000")

export default function LinkLobby() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const lobbyId = searchParams.get("lobbyId")
  const [lobby, setLobby] = useState<Player[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (!lobbyId) return

    socket.emit("joinLobby", lobbyId)
    socket.on("playerJoined", (players) => {
      console.log("[FRONT] Zaktualizowano listę graczy:", players)
      setLobby(players)
    })
    socket.on("playerKicked", (playerId) => {
      const myId = user?.id || localStorage.getItem("guestId")
      if (playerId === myId) {
        alert("Zostałeś wyrzucony z lobby")
        router.push("/play")
      }
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
      socket.off("playerKicked")
      socket.off("countdown")
      socket.off("gameStarted")
    }
  }, [lobbyId, user, router])

  const handleStartGame = async () => {
    const myId = user?.id || localStorage.getItem("guestId")
    const res = await fetch("http://localhost:4000/api/start-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lobbyId, creatorId: myId }),
    })
    const data = await res.json()
    if (!data.success) alert(data.error)
  }

  const handleKickPlayer = async (playerId: string) => {
    const myId = user?.id || localStorage.getItem("guestId")
    const res = await fetch("http://localhost:4000/api/kick-player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lobbyId, playerId, creatorId: myId }),
    })
    const data = await res.json()
    if (!data.success) alert(data.error)
  }

  const myId = user?.id || localStorage.getItem("guestId")
  const isCreator = myId === lobby[0]?.id

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Lobby: {code}</h1>
      <div className="my-4">
        {lobby.map((player) => (
          <div key={player.id} className="flex items-center my-2">
            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full mr-2" />
            <span>{player.name}</span>
            {isCreator && player.id !== myId && (
              <button onClick={() => handleKickPlayer(player.id)} className="ml-2 p-1 bg-red-500 text-white rounded">
                Wyrzuć
              </button>
            )}
          </div>
        ))}
      </div>
      {lobby.length === 2 && isCreator && (
        <button onClick={handleStartGame} className="p-2 bg-green-500 text-white rounded">
          Rozpocznij grę
        </button>
      )}
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
