"use client"

import ChessBoardContainer from "@/components/game/chessboard-container"
import { GameProvider } from "@/contexts/GameContext"
import { GameViewProvider } from "@/contexts/GameViewContext"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

/**
 * ChessPageContent
 *
 * Renderuje zawartość strony szachowej, ustawiając tło na podstawie aktualnego motywu.
 * Komponent oczekuje na zamontowanie (aby uniknąć problemów z hydracją) i dopiero wtedy renderuje interfejs gry.
 *
 * @returns {JSX.Element | null} Element JSX zawierający kontener szachownicy z odpowiednim tłem lub null, jeśli komponent nie został jeszcze zamontowany.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
function ChessPageContent() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          theme === "dark"
            ? "bg-[url('/backgrounds/darkThemeBg.png')]"
            : "bg-[url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80')]"
        }`}
      />
      <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/50" : "bg-white/30"} backdrop-blur-sm`} />
      <ChessBoardContainer />
    </div>
  )
}

/**
 * ChessPage
 *
 * Główny komponent strony szachowej. Opakowuje zawartość w konteksty GameProvider oraz GameViewProvider,
 * które dostarczają globalne dane i widoki gry.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę szachową.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function ChessPage() {
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("selectedColor") || "white"; 
  const selectedTimer = searchParams.get("gameType") || "300";
  
  useEffect( () => {
    console.error("ChessPage: ", selectedColor)
  }, [])

  return (
    <GameProvider ai={false} selectedColor={ selectedColor } timer={parseInt(selectedTimer)}>
      <GameViewProvider>
        <ChessPageContent />
      </GameViewProvider>
    </GameProvider>
  )
}
