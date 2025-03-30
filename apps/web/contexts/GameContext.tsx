"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i funkcji React
import { createContext, useContext, useEffect } from "react" // Funkcje React do kontekstu i efektów
import useGame from "@/hooks/useGame" // Hook do zarządzania stanem gry

/**
 * GameProviderProps
 *
 * Interfejs definiujący właściwości komponentu GameProvider.
 *
 * @property {React.ReactNode} children - Elementy potomne renderowane w ramach providera.
 * @property {boolean} ai - Czy gra jest przeciwko AI.
 * @property {string} selectedColor - Wybrany kolor gracza ("white" lub "black").
 * @property {number} timer - Czas trwania gry w sekundach.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface GameProviderProps {
  children: React.ReactNode
  ai: boolean
  selectedColor: string
  timer: number
}

// Tworzenie kontekstu gry z domyślną wartością null
const GameContext = createContext<ReturnType<typeof useGame> | null>(null)

/**
 * GameProvider
 *
 * Komponent providera kontekstu gry, dostarczający stan gry za pomocą hooka useGame.
 *
 * @param {GameProviderProps} props - Właściwości komponentu, w tym dzieci, tryb AI, kolor i timer.
 * @returns {JSX.Element} Element JSX reprezentujący provider kontekstu gry.
 *
 * @remarks
 * Komponent używa hooka useGame do zainicjalizowania logiki gry i dostarcza ją przez kontekst
 * do komponentów potomnych. Wymaga parametrów określających tryb gry (AI), kolor gracza i czas.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const GameProvider = ({ children, ai, selectedColor, timer }: GameProviderProps) => {
  const game = useGame(ai, selectedColor, timer) // Inicjalizacja stanu gry za pomocą hooka

  // Renderowanie providera kontekstu z wartością gry
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

/**
 * useGameContext
 *
 * Hook zwracający stan gry z kontekstu GameContext.
 *
 * @returns {ReturnType<typeof useGame>} Obiekt zawierający stan i metody gry.
 * @throws {Error} Jeśli hook jest użyty poza GameProvider.
 *
 * @remarks
 * Hook zapewnia dostęp do stanu gry w komponentach potomnych GameProvider. Rzuca błąd,
 * jeśli kontekst nie jest dostępny.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const useGameContext = () => {
  const context = useContext(GameContext) // Pobiera kontekst gry
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider") // Błąd przy braku kontekstu
  }
  return context // Zwraca stan gry
}
