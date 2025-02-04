"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useUser } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Send } from "lucide-react"

type Message = {
  sender: string
  text: string
  imageUrl: string
}

export default function OnlineGame() {
  const { isSignedIn, user } = useUser()
  const params = useParams()
  const roomId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [cooldown, setCooldown] = useState<number>(0)
  const socketRef = useRef<Socket | null>(null)
  const lastSentRef = useRef<number>(0)

  useEffect(() => {
    if (!isSignedIn || !user) return

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000")
      socketRef.current.emit("joinRoom", roomId)
    }

    socketRef.current.on("chatHistory", (data: Message[]) => {
      setMessages(data)
    })

    socketRef.current.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isSignedIn, user, roomId])

  // Obsługa licznika spamu
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown((prev) => Math.max(prev - 1, 0))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const sendMessage = () => {
    if (input.trim() === "") return

    const now = Date.now()
    if (now - lastSentRef.current < 2000) {
      // Ustawiamy czas pozostały do wysłania kolejnej wiadomości
      setCooldown(Math.ceil((2000 - (now - lastSentRef.current)) / 1000))
      return
    }

    lastSentRef.current = now

    const message: Message = {
      sender: user?.firstName || "Player",
      text: input,
      imageUrl: user?.imageUrl || "https://via.placeholder.com/40",
    }
    socketRef.current?.emit("sendMessage", { roomId, message })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="p-6 w-[80vh] mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Game Chat</h1>
      <Card className="p-4">
        <ScrollArea className="max-h-[50vh] space-y-3 overflow-y-auto">
          {messages.map((msg, index) => (
            <CardContent key={index} className="flex gap-2 items-center p-2 border rounded-lg shadow-md">
              <Avatar>
                <AvatarImage src={msg.imageUrl || "https://via.placeholder.com/40"} />
                <AvatarFallback>{msg.sender[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{msg.sender}</p>
                <p className="text-sm text-gray-600">{msg.text}</p>
              </div>
            </CardContent>
          ))}
        </ScrollArea>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button onClick={sendMessage} className="px-4 py-2 bg-white text-black rounded-md shadow-md border">
              <Send size={24} color="black" />
            </Button>
          </div>
          {cooldown > 0 && (
            <p className="text-xs text-red-600">
              Next message can be sent in {cooldown} second{cooldown > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
