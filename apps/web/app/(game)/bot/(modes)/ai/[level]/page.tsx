"use client"

import ChessBoardContainer from "@/components/game/chessboard-container"
import { GameProvider } from "@/contexts/GameContext"
import { GameViewProvider } from "@/contexts/GameViewContext"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * ChessPageContent
 *
 * Renderuje zawartość strony szachowej. Ustawia tło w zależności od aktualnego motywu (ciemny/jasny)
 * oraz renderuje komponent ChessBoardContainer.
 * Komponent oczekuje na zamontowanie, aby zapobiec problemom z hydracją.
 *
 * @returns {JSX.Element | null} Element JSX reprezentujący zawartość strony lub null, jeśli komponent nie został jeszcze zamontowany.
 *
 * @remarks
 * Autorzy: maxicom0000 i matiqueue
 */
function ChessPageContent(): JSX.Element | null {
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
 * Autorzy: maxicom0000 i matiqueue
 */
export default function ChessPage(): JSX.Element {
  return (
    <GameProvider>
      <GameViewProvider>
        <ChessPageContent />
      </GameViewProvider>
    </GameProvider>
  )
}
