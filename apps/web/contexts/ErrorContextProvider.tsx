"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i funkcji React
import { createContext, useContext, useEffect, useRef } from "react" // Funkcje React do kontekstu, efektów i referencji

// Tworzenie kontekstu do raportowania błędów
const ErrorContext = createContext<(data: any) => void>(() => {}) // Domyślna pusta funkcja

/**
 * useErrorReporter
 *
 * Hook zwracający funkcję raportowania błędów z kontekstu ErrorContext.
 *
 * @returns {(data: any) => void} Funkcja do wysyłania danych błędu.
 *
 * @remarks
 * Hook umożliwia komponentom potomnym korzystanie z mechanizmu raportowania błędów.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function useErrorReporter() {
  return useContext(ErrorContext) // Pobiera funkcję raportowania z kontekstu
}

/**
 * ErrorContextProviderProps
 *
 * Interfejs definiujący właściwości komponentu ErrorContextProvider.
 *
 * @property {React.ReactNode} children - Elementy potomne renderowane w ramach providera.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface ErrorContextProviderProps {
  children: React.ReactNode
}

/**
 * ErrorContextProvider
 *
 * Komponent providera kontekstu błędów, który ustawia połączenie WebSocket do raportowania błędów
 * i przechwytuje błędy z console.error, console.warn, window.error oraz unhandledrejection.
 *
 * @param {ErrorContextProviderProps} props - Właściwości komponentu, w tym elementy potomne.
 * @returns {JSX.Element} Element JSX reprezentujący provider kontekstu błędów.
 *
 * @remarks
 * Komponent łączy się z WebSocket na porcie 3005 i nadpisuje standardowe metody konsoli oraz
 * nasłuchuje globalnych błędów, wysyłając je w formacie JSON. Po odmontowaniu przywraca oryginalne
 * funkcje konsoli i zamyka połączenie.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function ErrorContextProvider({ children }: ErrorContextProviderProps) {
  const wsRef = useRef<WebSocket | null>(null) // Referencja do połączenia WebSocket

  /**
   * sendToErrors
   *
   * Funkcja wysyłająca dane błędu przez WebSocket, jeśli połączenie jest otwarte.
   *
   * @param {any} data - Dane błędu do wysłania.
   */
  const sendToErrors = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data)) // Wysłanie danych w formacie JSON
    }
  }

  // Efekt ustawiający WebSocket i przechwytujący błędy
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3005") // Inicjalizacja połączenia WebSocket

    wsRef.current.onopen = () => {
      console.log("Połączono z WebSocket w ErrorContextProvider") // Potwierdzenie połączenia
    }

    const originalConsoleError = console.error // Zachowanie oryginalnej funkcji console.error
    const originalConsoleWarn = console.warn // Zachowanie oryginalnej funkcji console.warn

    // Nadpisywanie console.error
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

    // Nadpisywanie console.warn
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

    // Nasłuchiwanie błędów window.error
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

    // Nasłuchiwanie błędów unhandledrejection
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

    // Czyszczenie po odmontowaniu
    return () => {
      console.error = originalConsoleError // Przywracanie oryginalnej funkcji
      console.warn = originalConsoleWarn // Przywracanie oryginalnej funkcji
      if (wsRef.current) wsRef.current.close() // Zamykanie połączenia WebSocket
    }
  }, []) // Puste zależności – uruchamia się raz przy montowaniu

  /**
   * reportError
   *
   * Funkcja raportująca błąd, przekazywana do kontekstu.
   *
   * @param {any} data - Dane błędu do zgłoszenia.
   */
  const reportError = (data: any) => {
    sendToErrors(data) // Wywołanie funkcji wysyłającej dane
  }

  // Renderowanie providera kontekstu
  return <ErrorContext.Provider value={reportError}>{children}</ErrorContext.Provider>
}
