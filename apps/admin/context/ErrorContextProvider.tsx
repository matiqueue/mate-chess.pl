"use client"

import { createContext, useContext, useEffect, useRef, ReactNode } from "react"

/**
 * Kontekst przechowujący funkcję raportowania błędów.
 */
const ErrorContext = createContext<(data: any) => void>(() => {})

/**
 * Hook do pobierania funkcji raportowania błędów.
 *
 * @returns {(data: any) => void} Funkcja raportująca błędy.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export function useErrorReporter(): (data: any) => void {
  return useContext(ErrorContext)
}

/**
 * ErrorContextProvider
 *
 * Opakowuje dzieci, dostarczając im możliwość raportowania błędów globalnie za pomocą WebSocket.
 * Przechwytuje błędy z konsoli oraz zdarzenia globalne i wysyła je do serwera.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne, które mają dostęp do kontekstu błędów.
 * @returns {JSX.Element} Element JSX opakowujący dzieci w ErrorContext.Provider.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export function ErrorContextProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null)

  /**
   * Wysyła dane błędu do serwera, jeśli połączenie WebSocket jest otwarte.
   *
   * @param {any} data - Dane błędu do wysłania.
   */
  const sendToErrors = (data: any): void => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3005")

    wsRef.current.onopen = () => {
      console.log("Połączono z WebSocket w ErrorContextProvider (admin)")
    }

    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    console.error = (...args) => {
      originalConsoleError(...args)
      const message = args.join(" ")
      sendToErrors({
        type: "error",
        app: "admin",
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
        app: "admin",
        filePath: "nieznana ścieżka (console.warn)",
        message,
        timestamp: new Date().toISOString(),
      })
    }

    window.addEventListener("error", (event) => {
      const errorData = {
        type: "error",
        app: "admin",
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
        app: "admin",
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

  /**
   * Raportuje błąd poprzez wywołanie wewnętrznej funkcji sendToErrors.
   *
   * @param {any} data - Dane błędu do raportowania.
   */
  const reportError = (data: any): void => {
    sendToErrors(data)
  }

  return <ErrorContext.Provider value={reportError}>{children}</ErrorContext.Provider>
}
