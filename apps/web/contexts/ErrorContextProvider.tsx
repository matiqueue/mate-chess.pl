// apps/web/contexts/ErrorContextProvider.tsx
"use client"

import { createContext, useContext, useEffect, useRef } from "react"

const ErrorContext = createContext<(data: any) => void>(() => {})

export function useErrorReporter() {
  return useContext(ErrorContext)
}

export function ErrorContextProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null)

  // Definicja sendToErrors przed użyciem
  const sendToErrors = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3005")

    wsRef.current.onopen = () => {
      console.log("Połączono z WebSocket w ErrorContextProvider")
    }

    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.error = (...args) => {
      originalConsoleError(...args)
      const message = args.join(" ")
      sendToErrors({
        type: "error",
        app: "web",
        filePath: "nieznana ścieżka (console.error)",
        message,
        timestamp: new Date().toISOString(),
      })
    }

    console.warn = (...args) => {
      originalConsoleWarn(...args)
      const message = args.join(" ")
      sendToErrors({
        type: "warning",
        app: "web",
        filePath: "nieznana ścieżka (console.warn)",
        message,
        timestamp: new Date().toISOString(),
      })
    }

    window.addEventListener("error", (event) => {
      const errorData = {
        type: "error",
        app: "web",
        filePath: event.filename || "nieznana ścieżka",
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      }
      sendToErrors(errorData)
    })

    window.addEventListener("unhandledrejection", (event) => {
      const errorData = {
        type: "error",
        app: "web",
        filePath: "nieznana ścieżka (unhandledrejection)",
        message: event.reason.message || String(event.reason),
        stack: event.reason.stack,
        timestamp: new Date().toISOString(),
      }
      sendToErrors(errorData)
    })

    return () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
      if (wsRef.current) wsRef.current.close()
    }
  }, [])

  const reportError = (data: any) => {
    sendToErrors(data)
  }

  return <ErrorContext.Provider value={reportError}>{children}</ErrorContext.Provider>
}
