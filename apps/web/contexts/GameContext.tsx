// GameContext.tsx
"use client"

import { createContext, useContext } from "react"
import useGame from "@/hooks/useGame"

// Tworzymy kontekst, którego typ będzie oparty o wynik hooka useGame
const GameContext = createContext<ReturnType<typeof useGame> | null>(null)

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const game = useGame()
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
