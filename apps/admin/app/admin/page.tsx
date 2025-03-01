"use client"

import { useState, useEffect } from "react"
import io, { Socket } from "socket.io-client"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users")
  const [logs, setLogs] = useState<string[]>([])
  const [, setSocket] = useState<Socket | null>(null)
  const MAX_LOGS = 200

  useEffect(() => {
    if (activeTab === "logs") {
      const newSocket = io("http://localhost:4000/admin-logs", {
        reconnection: true,
      })

      newSocket.on("connect", () => {
        console.log("Połączono z serwerem logów") // Debug
      })

      // Odbierz początkowe logi
      newSocket.on("initial_logs", (initialLogs: string[]) => {
        console.log("Otrzymano początkowe logi:", initialLogs) // Debug
        setLogs(initialLogs.slice(-MAX_LOGS)) // Ustaw początkowe logi (max 200)
      })

      // Odbierz nowe logi
      newSocket.on("log", (message: string) => {
        console.log("Otrzymano log:", message) // Debug
        setLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, message]
          if (updatedLogs.length > MAX_LOGS) {
            return updatedLogs.slice(-MAX_LOGS) // Ogranicz do 200
          }
          return updatedLogs
        })
      })

      newSocket.on("connect_error", (error) => {
        console.error("Błąd połączenia:", error) // Debug
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
        setSocket(null)
      }
    }
  }, [activeTab])

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel Admina</h1>
      <div>
        <button onClick={() => setActiveTab("users")}>Użytkownicy</button>
        <button onClick={() => setActiveTab("logs")}>Logi</button>
      </div>

      {activeTab === "users" && (
        <div>
          <h2>Użytkownicy</h2>
          <p>Tutaj będą użytkownicy (do zrobienia później).</p>
        </div>
      )}

      {activeTab === "logs" && (
        <div>
          <h2>Logi serwera</h2>
          <pre>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
