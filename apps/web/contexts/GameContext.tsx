"use client"

import { createContext, useContext, useEffect } from "react"
import useGame from "@/hooks/useGame"

interface GameProviderProps {
  children: React.ReactNode
  ai: boolean
  selectedColor: string
}

const GameContext = createContext<ReturnType<typeof useGame> | null>(null)

export const GameProvider = ({ children, ai, selectedColor }: GameProviderProps) => {
  const game = useGame(ai, selectedColor)

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
