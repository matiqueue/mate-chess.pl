"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface AppContextType {
  isLeftSidebarVisible: boolean
  toggleLeftSidebar: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true)

  const toggleLeftSidebar = () => {
    setIsLeftSidebarVisible((prev) => !prev)
  }

  return <AppContext.Provider value={{ isLeftSidebarVisible, toggleLeftSidebar }}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

