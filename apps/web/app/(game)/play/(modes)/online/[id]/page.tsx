"use client"

import ChessBoardContainer from "@/components/game/chessboard-container"
import { useEffect, useState } from "react"
import { use } from "react"
import io from "socket.io-client"

// Inicjalizacja połączenia WebSocket z serwerem
const socket = io("http://localhost:4000")

/**
 * Game
 *
 * Komponent renderujący interfejs gry, który umożliwia dołączenie do pokoju (lobby)
 * oraz komunikację w czasie rzeczywistym za pomocą WebSocket. Użytkownik może wysyłać
 * i odbierać wiadomości.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {Promise<{ id: string }>} props.params - Obiekt parametrów zawierający identyfikator pokoju.
 * @returns {JSX.Element} Element JSX reprezentujący interfejs gry.
 *
 * @remarks
 * Autor: nasakrator
 */
export default function Game({ params }: { params: Promise<{ id: string }> }) {
  // Pobranie parametrów (Next.js 15)
  const { id } = use(params)

  // Stan przechowujący listę odebranych wiadomości
  const [messages, setMessages] = useState<string[]>([])
  // Stan przechowujący bieżącą wiadomość wpisywaną przez użytkownika
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Dołączenie do pokoju o danym identyfikatorze
    socket.emit("joinLobby", id)
    // Nasłuchiwanie na nowe wiadomości
    socket.on("newMessage", (msg: string) => setMessages((prev) => [...prev, msg]))
    // Czyszczenie nasłuchiwania przy odmontowaniu komponentu
    return () => {
      socket.off("newMessage")
    }
  }, [id])

  /**
   * handleSendMessage
   *
   * Wysyła aktualnie wpisaną wiadomość do pokoju i czyści pole tekstowe.
   */
  const handleSendMessage = (): void => {
    socket.emit("sendMessage", id, message)
    setMessage("")
  }

  const fixedClerkDataFertcher = (): boolean => {
    const response = fetch("http://localhost:4000/api/clerk", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return false
  }

  return (
    <div className="p-4">
      <p className="text-center text-red-500 font-bold text-lg">Strona w przebudowie</p>
      <p className="text-center text-gray-700">Jeżeli chcesz zagrać w trybie online, przełącz aplikację do trybu wstępnego.</p>
      <h1 className="text-2xl font-bold">Gra: {id}</h1>
      <div className="my-4 h-64 overflow-y-auto border p-2">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="p-2 border w-full" />
      <button onClick={handleSendMessage} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Wyślij
      </button>
      {fixedClerkDataFertcher() ? <ChessBoardContainer /> : false} // TODO: Naprawić ten błąd, aby nie wywalało błędu z Clerk
    </div>
  )
}
