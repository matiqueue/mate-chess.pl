"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark"

interface AppContextType {
  theme: Theme
  toggleTheme: () => void
  isLeftSidebarVisible: boolean
  toggleLeftSidebar: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true)

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const toggleLeftSidebar = () => {
    setIsLeftSidebarVisible((prev) => !prev)
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, isLeftSidebarVisible, toggleLeftSidebar }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

