"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i typów React
import { createContext, useContext, useState, ReactNode } from "react" // Funkcje React do kontekstu, stanu i typów

/**
 * GameViewContextType
 *
 * Interfejs definiujący typ kontekstu widoku gry.
 *
 * @property {"2D" | "3D" | undefined} viewMode - Aktualny tryb widoku gry (2D, 3D lub niezdefiniowany).
 * @property {(mode: "2D" | "3D" | undefined) => void} setViewMode - Funkcja ustawiająca tryb widoku.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface GameViewContextType {
  viewMode: "2D" | "3D" | undefined
  setViewMode: (mode: "2D" | "3D" | undefined) => void
}

// Tworzenie kontekstu widoku gry z domyślną wartością undefined
const GameViewContext = createContext<GameViewContextType | undefined>(undefined)

/**
 * GameViewProviderProps
 *
 * Interfejs definiujący właściwości komponentu GameViewProvider.
 *
 * @property {ReactNode} children - Elementy potomne renderowane w ramach providera.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface GameViewProviderProps {
  children: ReactNode
}

/**
 * GameViewProvider
 *
 * Komponent providera kontekstu widoku gry, zarządzający stanem trybu widoku (2D lub 3D).
 *
 * @param {GameViewProviderProps} props - Właściwości komponentu, w tym elementy potomne.
 * @returns {JSX.Element} Element JSX reprezentujący provider kontekstu widoku gry.
 *
 * @remarks
 * Komponent dostarcza stan widoku gry (2D/3D) i funkcję do jego zmiany poprzez kontekst.
 * Początkowy stan jest niezdefiniowany (undefined).
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const GameViewProvider = ({ children }: GameViewProviderProps) => {
  const [viewMode, setViewMode] = useState<"2D" | "3D" | undefined>(undefined) // Stan trybu widoku

  // Renderowanie providera kontekstu z wartościami widoku
  return <GameViewContext.Provider value={{ viewMode, setViewMode }}>{children}</GameViewContext.Provider>
}

/**
 * useGameView
 *
 * Hook zwracający stan i funkcje widoku gry z kontekstu GameViewContext.
 *
 * @returns {GameViewContextType} Obiekt zawierający tryb widoku i funkcję jego zmiany.
 * @throws {Error} Jeśli hook jest użyty poza GameViewProvider.
 *
 * @remarks
 * Hook zapewnia dostęp do stanu widoku gry w komponentach potomnych GameViewProvider.
 * Rzuca błąd, jeśli kontekst nie jest dostępny.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const useGameView = () => {
  const context = useContext(GameViewContext) // Pobiera kontekst widoku gry
  if (!context) {
    throw new Error("useGameView must be used within a GameViewProvider") // Błąd przy braku kontekstu
  }
  return context // Zwraca stan i funkcje widoku gry
}
