"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:4000")

export default function Game({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [messages, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    socket.emit("joinLobby", code)
    socket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]))
    return () => socket.off("newMessage")
  }, [code])

  const handleSendMessage = () => {
    socket.emit("sendMessage", code, message)
    setMessage("")
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Gra: {code}</h1>
      <div className="my-4 h-64 overflow-y-auto border p-2">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="p-2 border w-full" />
      <button onClick={handleSendMessage} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Wyślij
      </button>
    </div>
  )
}
