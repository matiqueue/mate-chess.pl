"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SidebarMode = "default" | "console"

interface SidebarContextType {
  mode: SidebarMode
  setMode: (mode: SidebarMode) => void
  logToSidebar: (message: string) => void
  consoleLogs: string[]
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SidebarMode>("default")
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])

  const logToSidebar = (message: string) => {
    setConsoleLogs((prev) => [...prev, message])
  }

  return <SidebarContext.Provider value={{ mode, setMode, logToSidebar, consoleLogs }}>{children}</SidebarContext.Provider>
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}
