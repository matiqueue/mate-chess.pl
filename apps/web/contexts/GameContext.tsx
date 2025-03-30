"use client"

import { createContext, useContext, useEffect } from "react"
import useGame from "@/hooks/useGame"

interface GameProviderProps {
  children: React.ReactNode
  ai: boolean
  selectedColor: string
  timer: number
  level: number
}

const GameContext = createContext<ReturnType<typeof useGame> | null>(null)

export const GameProvider = ({ children, ai, selectedColor, timer, level }: GameProviderProps) => {
  const game = useGame(ai, selectedColor, timer, level)

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
