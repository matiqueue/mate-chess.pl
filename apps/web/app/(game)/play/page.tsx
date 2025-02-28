"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function Play() {
  const { user } = useUser()
  const router = useRouter()
  const [code, setCode] = useState("")

  const handleCreateLinkLobby = async () => {
    const player = user
      ? { id: user.id, name: user.firstName || "User", avatar: user.imageUrl || "", isGuest: false }
      : { id: localStorage.getItem("guestId") || uuidv4(), name: "Guest", avatar: "/default-avatar.png", isGuest: true }

    if (player.isGuest && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", player.id)
    }

    const res = await fetch("http://localhost:4000/api/create-link-lobby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player }),
    })
    const data = await res.json()
    router.push(`/play/link?code=${data.code}`)
  }

  const handleJoinLinkLobby = async () => {
    const player = user
      ? { id: user.id, name: user.firstName || "User", avatar: user.imageUrl || "", isGuest: false }
      : { id: localStorage.getItem("guestId") || uuidv4(), name: "Guest", avatar: "/default-avatar.png", isGuest: true }

    if (player.isGuest && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", player.id)
    }

    const res = await fetch("http://localhost:4000/api/join-link-lobby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, player }),
    })
    const data = await res.json()
    if (data.lobbyId) {
      router.push(`/play/link?code=${code}`)
    } else {
      alert(data.error)
    }
  }

  const handleJoinOnlineLobby = async () => {
    if (!user) {
      alert("You need to be logged in to play online")
      return
    }

    const player = { id: user.id, name: user.firstName || "User", avatar: user.imageUrl || "", isGuest: false }

    const res = await fetch("http://localhost:4000/api/join-online-lobby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player }),
    })
    const data = await res.json()
    if (data.lobbyId) {
      router.push(`/play/online?lobbyId=${data.lobbyId}`)
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Wybierz tryb gry</h1>
      <button onClick={handleCreateLinkLobby} className="m-2 p-2 bg-blue-500 text-white rounded">
        Stwórz lobby z linkiem
      </button>
      <div className="my-2">
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Wprowadź kod" className="p-2 border" />
        <button onClick={handleJoinLinkLobby} className="m-2 p-2 bg-green-500 text-white rounded">
          Dołącz do lobby z linkiem
        </button>
      </div>
      <button onClick={handleJoinOnlineLobby} className="m-2 p-2 bg-purple-500 text-white rounded">
        Graj online
      </button>
    </div>
  )
}
