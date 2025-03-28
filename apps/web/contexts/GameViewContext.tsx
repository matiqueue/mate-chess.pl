"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface GameViewContextType {
  viewMode: "2D" | "3D" | undefined
  setViewMode: (mode: "2D" | "3D" | undefined) => void
}

const GameViewContext = createContext<GameViewContextType | undefined>(undefined)

export const GameViewProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<"2D" | "3D" | undefined>(undefined)

  return <GameViewContext.Provider value={{ viewMode, setViewMode }}>{children}</GameViewContext.Provider>
}

export const useGameView = () => {
  const context = useContext(GameViewContext)
  if (!context) {
    throw new Error("useGameView must be used within a GameViewProvider")
  }
  return context
}
