"use client" // Dyrektywa określająca, że kod działa po stronie klienta

import React, {
  createContext, // Funkcja do tworzenia kontekstu
  useState, // Hook do zarządzania stanem
  useEffect, // Hook do efektów ubocznych
  useRef, // Hook do przechowywania referencji
  ReactNode, // Typ dla dzieci React
  useContext, // Hook do używania kontekstu
} from "react"
import { usePathname } from "next/navigation" // Hook Next.js do pobierania aktualnej ścieżki URL

/**
 * AudioContextType
 *
 * Interfejs definiujący strukturę kontekstu audio. Zawiera stan odtwarzania muzyki
 * oraz funkcję do przełączania jej stanu.
 *
 * @property {boolean} isPlaying - Czy muzyka jest obecnie odtwarzana.
 * @property {(event?: React.MouseEvent) => void} toggleMusic - Funkcja przełączająca odtwarzanie/pauzowanie muzyki.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
type AudioContextType = {
  isPlaying: boolean // Stan wskazujący, czy muzyka jest odtwarzana
  toggleMusic: (event?: React.MouseEvent) => void // Funkcja do sterowania muzyką
}

/**
 * AudioContext
 *
 * Kontekst React do zarządzania stanem odtwarzania muzyki w aplikacji. Domyślnie
 * muzyka jest zatrzymana, a funkcja toggleMusic jest pusta.
 */
const AudioContext = createContext<AudioContextType>({
  isPlaying: false, // Domyślny stan: muzyka zatrzymana
  toggleMusic: () => {}, // Domyślna pusta funkcja
})

/**
 * AudioProvider
 *
 * Dostawca kontekstu audio, który zarządza odtwarzaniem muzyki w tle na stronie /home.
 * Tworzy instancję audio, kontroluje jej stan i udostępnia funkcje sterujące dzieciom
 * w drzewie komponentów.
 *
 * @param {Object} props - Właściwości komponentu.
 * @param {ReactNode} props.children - Dzieci React, które będą miały dostęp do kontekstu.
 * @returns {JSX.Element} Element JSX dostarczający kontekst audio.
 *
 * @remarks
 * Muzyka odtwarzana jest tylko na stronie /home i pauzowana przy zmianie ścieżki.
 * Używa `Audio` API z obsługą błędów i zapętlaniem.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const AudioProvider = ({ children }: { children: ReactNode }) => {
  // Stan wskazujący, czy muzyka jest odtwarzana
  const [isPlaying, setIsPlaying] = useState(false)
  // Referencja do obiektu HTMLAudioElement dla muzyki tła
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Pobieranie aktualnej ścieżki URL
  const pathname = usePathname()

  // Efekt zarządzający inicjalizacją i pauzowaniem muzyki w zależności od ścieżki
  useEffect(() => {
    if (pathname === "/home") {
      // Inicjalizacja audio tylko na stronie /home
      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/bgMusic.mp3") // Tworzenie instancji audio
        audioRef.current.volume = 0.1 // Ustawienie głośności na 10%
        audioRef.current.loop = true // Włączenie zapętlania muzyki
      }
    } else {
      // Pauzowanie i resetowanie muzyki przy opuszczeniu /home
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause() // Zatrzymanie odtwarzania
        audioRef.current.currentTime = 0 // Reset pozycji odtwarzania do początku
        setIsPlaying(false) // Aktualizacja stanu
      }
    }
  }, [pathname]) // Zależność: zmiana ścieżki URL

  /**
   * toggleMusic
   *
   * Funkcja przełączająca stan odtwarzania muzyki. Odtwarza muzykę, jeśli jest zatrzymana,
   * lub pauzuje, jeśli jest odtwarzana.
   *
   * @param {React.MouseEvent} [event] - Opcjonalne zdarzenie kliknięcia (dla zatrzymania propagacji).
   */
  const toggleMusic = (event?: React.MouseEvent) => {
    event?.stopPropagation() // Zatrzymanie propagacji zdarzenia, jeśli istnieje
    if (!audioRef.current) return // Wyjście, jeśli audio nie jest zainicjalizowane

    if (audioRef.current.paused) {
      // Odtwarzanie muzyki, jeśli jest zatrzymana
      audioRef.current
        .play()
        .then(() => setIsPlaying(true)) // Aktualizacja stanu na "odtwarzane"
        .catch(
          (error) => console.error("Błąd odtwarzania muzyki:", error), // Logowanie błędów
        )
    } else {
      // Pauzowanie muzyki, jeśli jest odtwarzana
      audioRef.current.pause()
      setIsPlaying(false) // Aktualizacja stanu na "zatrzymane"
    }
  }

  // Renderowanie dostawcy kontekstu z wartościami stanu i funkcji
  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic }}>
      {children} {/* Przekazanie dzieciom dostępu do kontekstu */}
    </AudioContext.Provider>
  )
}

/**
 * useAudio
 *
 * Hook niestandardowy umożliwiający komponentom potomnym dostęp do kontekstu audio.
 *
 * @returns {AudioContextType} Obiekt z wartościami kontekstu audio.
 *
 * @remarks
 * Umożliwia łatwe użycie stanu `isPlaying` i funkcji `toggleMusic` w innych komponentach.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const useAudio = (): AudioContextType => useContext(AudioContext) // Zwrócenie wartości kontekstu
