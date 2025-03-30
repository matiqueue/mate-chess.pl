"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i typów React
import { createContext, useContext, useState, ReactNode } from "react" // Funkcje React do kontekstu, stanu i typów

/**
 * SidebarMode
 *
 * Typ określający możliwe tryby paska bocznego.
 *
 * @typedef {"default" | "console"} SidebarMode
 */
type SidebarMode = "default" | "console"

/**
 * SidebarContextType
 *
 * Interfejs definiujący typ kontekstu paska bocznego.
 *
 * @property {SidebarMode} mode - Aktualny tryb paska bocznego ("default" lub "console").
 * @property {(mode: SidebarMode) => void} setMode - Funkcja ustawiająca tryb paska bocznego.
 * @property {(message: string) => void} logToSidebar - Funkcja dodająca wiadomość do logów konsoli.
 * @property {string[]} consoleLogs - Tablica przechowująca logi konsoli.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface SidebarContextType {
  mode: SidebarMode
  setMode: (mode: SidebarMode) => void
  logToSidebar: (message: string) => void
  consoleLogs: string[]
}

// Tworzenie kontekstu paska bocznego z domyślną wartością undefined
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

/**
 * SidebarContextProviderProps
 *
 * Interfejs definiujący właściwości komponentu SidebarContextProvider.
 *
 * @property {ReactNode} children - Elementy potomne renderowane w ramach providera.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface SidebarContextProviderProps {
  children: ReactNode
}

/**
 * SidebarContextProvider
 *
 * Komponent providera kontekstu paska bocznego, zarządzający trybem i logami konsoli.
 *
 * @param {SidebarContextProviderProps} props - Właściwości komponentu, w tym elementy potomne.
 * @returns {JSX.Element} Element JSX reprezentujący provider kontekstu paska bocznego.
 *
 * @remarks
 * Komponent dostarcza stan trybu paska bocznego ("default" lub "console"), funkcję jego zmiany,
 * funkcję dodawania logów oraz tablicę logów poprzez kontekst. Początkowy tryb to "default".
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function SidebarContextProvider({ children }: SidebarContextProviderProps) {
  const [mode, setMode] = useState<SidebarMode>("default") // Stan trybu paska bocznego
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]) // Stan logów konsoli

  /**
   * logToSidebar
   *
   * Funkcja dodająca nową wiadomość do logów konsoli.
   *
   * @param {string} message - Wiadomość do zalogowania.
   */
  const logToSidebar = (message: string) => {
    setConsoleLogs((prev) => [message]) // Dodaje wiadomość do istniejących logów
  }

  // Renderowanie providera kontekstu z wartościami paska bocznego
  return <SidebarContext.Provider value={{ mode, setMode, logToSidebar, consoleLogs }}>{children}</SidebarContext.Provider>
}

/**
 * useSidebarContext
 *
 * Hook zwracający stan i funkcje paska bocznego z kontekstu SidebarContext.
 *
 * @returns {SidebarContextType} Obiekt zawierający tryb, funkcję zmiany trybu, logowanie i logi.
 * @throws {Error} Jeśli hook jest użyty poza SidebarContextProvider.
 *
 * @remarks
 * Hook zapewnia dostęp do stanu i funkcji paska bocznego w komponentach potomnych
 * SidebarContextProvider. Rzuca błąd, jeśli kontekst nie jest dostępny.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function useSidebarContext() {
  const context = useContext(SidebarContext) // Pobiera kontekst paska bocznego
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider") // Błąd przy braku kontekstu
  }
  return context // Zwraca stan i funkcje paska bocznego
}
