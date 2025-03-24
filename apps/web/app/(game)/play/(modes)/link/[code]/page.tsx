"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import io from "socket.io-client"

// Inicjalizacja połączenia WebSocket z serwerem
const socket = io("http://localhost:4000")

/**
 * Game
 *
 * Komponent umożliwiający komunikację w pokoju gry za pomocą WebSocket.
 * Użytkownik może dołączać do pokoju na podstawie kodu (pobrane z parametrów) oraz wysyłać i odbierać wiadomości.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {Promise<{ code: string }>} props.params - Obiekt parametrów zawierający kod pokoju.
 * @returns {JSX.Element} Element JSX reprezentujący interfejs gry.
 *
 * @remarks
 * Autor: nasakrator
 */
export default function Game({ params }: { params: Promise<{ code: string }> }): JSX.Element {
  // Pobranie kodu pokoju z parametrów (Next.js 15)
  const { code } = use(params)

  // Stan przechowujący odebrane wiadomości
  const [messages, setMessages] = useState<string[]>([])
  // Stan przechowujący bieżącą wiadomość wpisywaną przez użytkownika
  const [message, setMessage] = useState("")

  // Ustawienie nasłuchiwania na wiadomości przy dołączeniu do pokoju
  useEffect(() => {
    socket.emit("joinLobby", code)
    socket.on("newMessage", (msg: string) => setMessages((prev) => [...prev, msg]))
    // Czyszczenie nasłuchiwania przy demontażu komponentu
    return () => {
      socket.off("newMessage");
    };
  }, [code])

  /**
   * handleSendMessage
   *
   * Wysyła bieżącą wiadomość do pokoju i czyści pole tekstowe.
   */
  const handleSendMessage = (): void => {
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
