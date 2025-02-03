"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useRouter, useParams } from "next/navigation"

type Message = {
  sender: string
  text: string
}

export default function OnlineGame() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const params = useParams()
  const roomId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!isSignedIn || !user) return

    // Inicjujemy połączenie socket, jeśli jeszcze nie jest utworzone.
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000")
      // Dołączamy do pokoju – dzięki temu otrzymujemy wiadomości od pozostałych graczy.
      socketRef.current.emit("joinRoom", roomId)
    }

    // Nasłuchujemy wiadomości wysłanych przez innych graczy.
    socketRef.current.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isSignedIn, user, roomId])

  const sendMessage = () => {
    if (input.trim() === "") return
    const message: Message = { sender: user?.firstName || "Player", text: input }
    // Emitujemy wiadomość do serwera, który rozesła ją do całego pokoju.
    socketRef.current?.emit("sendMessage", { roomId, message })
    setInput("")
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="mb-4">Please sign in to play online.</p>
        <SignInButton />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Online Game Room</h1>
      <p className="mb-4">Room ID: {roomId}</p>
      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Chat</h2>
        <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-gray-200 rounded">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
