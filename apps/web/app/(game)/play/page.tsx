"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function CreateGamePage() {
  const router = useRouter()
  const [host, setHost] = useState<"server" | "player">("server")
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  async function handleCreateSession() {
    if (!user) {
      alert("Musisz być zalogowany, aby stworzyć grę.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Nie udało się stworzyć sesji.")
      }

      const data = await response.json()
      const { sessionId, host: sessionHost } = data

      // Przekieruj do strony gry
      router.push(`/play/${sessionId}?host=${sessionHost}`)
    } catch (error: any) {
      console.error("Error creating session:", error)
      alert(error.message || "Błąd podczas tworzenia sesji.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Stwórz Nową Grę</h1>
      {user ? <p>Zalogowany jako: {user.fullName || user.username || "Nieznany użytkownik"}</p> : <p>Nie jesteś zalogowany.</p>}
      <div style={{ marginTop: 20 }}>
        <label htmlFor="host-select">Host gry:</label>
        <select id="host-select" value={host} onChange={(e) => setHost(e.target.value as "server" | "player")} style={{ marginLeft: 10 }}>
          <option value="server">Serwer</option>
          <option value="player">Gracz</option>
        </select>
      </div>
      <button onClick={handleCreateSession} style={{ marginTop: 20 }} disabled={loading}>
        {loading ? "Tworzenie..." : "Utwórz Pokój"}
      </button>
    </div>
  )
}
