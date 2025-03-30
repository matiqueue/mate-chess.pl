"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import type React from "react" // Import typu React dla typowania
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { SidebarTrigger } from "@workspace/ui/components/sidebar" // Komponent wyzwalacza paska bocznego
import { ModeToggle } from "@workspace/ui/components/mode-toggle" // Komponent przełącznika motywu
import { Volume2, VolumeOff } from "lucide-react" // Ikony z biblioteki Lucide dla dźwięku
import { useAudio } from "@/components/home/audio-provider" // Hook niestandardowy do zarządzania dźwiękiem
import { LanguageSwitcher } from "./language-switcher" // Komponent przełącznika języków
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import ChessMessageSystem from "./chess-message-system" // Komponent systemu wiadomości szachowych
import ChessNotifications from "./chess-notifications" // Komponent systemu powiadomień szachowych
import EnhancedSearch from "./enhanced-search" // Komponent zaawansowanego wyszukiwania
import { cn } from "@workspace/ui/lib/utils" // Util do łączenia klas CSS
import { useEffect, useState } from "react" // Hooki React do efektów i stanu

/**
 * NavbarProps
 *
 * Interfejs definiujący właściwości komponentu Navbar.
 *
 * @property {string} [className] - Opcjonalna klasa CSS dla stylizacji nadrzędnej.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
type NavbarProps = React.HTMLAttributes<HTMLElement>

/**
 * Navbar
 *
 * Komponent paska nawigacyjnego dla wersji desktopowej aplikacji szachowej. Zawiera
 * wyzwalacz paska bocznego, wyszukiwarkę, powiadomienia, wiadomości, przełącznik
 * motywu, sterowanie dźwiękiem i przełącznik języków.
 *
 * @param {NavbarProps} props - Właściwości komponentu, w tym opcjonalna klasa CSS.
 * @returns {JSX.Element | null} Element JSX reprezentujący pasek nawigacyjny lub null przed zamontowaniem.
 *
 * @remarks
 * Komponent renderuje się tylko po zamontowaniu po stronie klienta, aby uniknąć
 * problemów z hydratacją. Integruje wiele funkcji interaktywnych, takich jak audio
 * i tłumaczenia.
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 * @source Własna implementacja
 */
export function Navbar({ className }: NavbarProps) {
  // Pobieranie stanu odtwarzania i funkcji przełączania muzyki z kontekstu audio
  const { isPlaying, toggleMusic } = useAudio()
  // Hook do tłumaczeń
  const { t } = useTranslation()
  // Stan określający, czy komponent jest zamontowany
  const [mounted, setMounted] = useState(false)

  // Efekt ustawiający flagę zamontowania po stronie klienta
  useEffect(() => {
    setMounted(true) // Ustawienie stanu na true po zamontowaniu
  }, []) // Puste zależności - efekt uruchamia się raz po zamontowaniu

  // Zwrócenie null przed zamontowaniem, aby uniknąć błędów hydratacji
  if (!mounted) return null

  // Renderowanie paska nawigacyjnego
  return (
    <header className={cn("w-full h-16 border-b px-6 flex items-center gap-6 bg-sidebar", className)}>
      <SidebarTrigger /> {/* Wyzwalacz paska bocznego */}
      <EnhancedSearch className="flex-1 max-w-sm" /> {/* Komponent wyszukiwania z ograniczoną szerokością */}
      {/* Sekcja z ikonami i funkcjami */}
      <div className="flex items-center gap-4">
        <ChessNotifications /> {/* System powiadomień szachowych */}
        <ChessMessageSystem /> {/* System wiadomości szachowych */}
        <ModeToggle /> {/* Przełącznik motywu jasny/ciemny */}
        <Button variant="ghost" size="icon" onClick={toggleMusic}>
          {isPlaying ? <Volume2 /> : <VolumeOff />} {/* Ikona dźwięku zależna od stanu odtwarzania */}
        </Button>
        <LanguageSwitcher /> {/* Przełącznik języków */}
      </div>
    </header>
  )
}
