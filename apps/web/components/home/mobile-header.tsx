"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import { Search, Volume2, VolumeOff } from "lucide-react" // Ikony z biblioteki Lucide
import Link from "next/link" // Komponent Link z Next.js do nawigacji
import { cn } from "@workspace/ui/lib/utils" // Util do łączenia klas CSS
import { Input } from "@workspace/ui/components/input" // Komponent pola tekstowego UI
import { SidebarTrigger } from "@workspace/ui/components/sidebar" // Komponent wyzwalacza paska bocznego
import { usePathname } from "next/navigation" // Hook Next.js do pobierania aktualnej ścieżki URL
import { ModeToggle } from "@workspace/ui/components/mode-toggle" // Komponent przełącznika motywu
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { useAudio } from "./audio-provider" // Hook niestandardowy do zarządzania dźwiękiem

/**
 * MobileHeaderProps
 *
 * Interfejs definiujący właściwości komponentu MobileHeader.
 *
 * @property {string} [className] - Opcjonalna klasa CSS dla stylizacji nadrzędnej.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
type MobileHeaderProps = React.HTMLAttributes<HTMLDivElement>

/**
 * MobileHeader
 *
 * Komponent nagłówka mobilnego wyświetlający logo, pole wyszukiwania (opcjonalne),
 * przełącznik motywu i przycisk sterowania dźwiękiem. Ukrywa pole wyszukiwania
 * na określonych ścieżkach związanych z grą online.
 *
 * @param {MobileHeaderProps} props - Właściwości komponentu, w tym opcjonalna klasa CSS.
 * @returns {JSX.Element} Element JSX reprezentujący nagłówek mobilny.
 *
 * @remarks
 * Komponent korzysta z kontekstu audio (`useAudio`) do sterowania muzyką w tle.
 * Używa `usePathname` do dynamicznego ukrywania paska wyszukiwania na stronach gry.
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 * @source Własna implementacja
 */
export function MobileHeader({ className }: MobileHeaderProps) {
  // Pobieranie aktualnej ścieżki URL
  const pathname = usePathname()
  // Pobieranie stanu odtwarzania i funkcji przełączania muzyki z kontekstu audio
  const { isPlaying, toggleMusic } = useAudio()

  // Określenie, czy pasek wyszukiwania powinien być ukryty na podstawie ścieżki
  const hideNavbar = pathname.startsWith("/play/online/") || pathname.startsWith("/play/link/")

  // Renderowanie nagłówka
  return (
    <header className={cn("flex flex-col border-b", className)}>
      {/* Główna sekcja nagłówka */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <SidebarTrigger /> {/* Wyzwalacz paska bocznego */}
          <Link href="/home">
            <h1 className="ml-4 text-xl font-bold text-foreground">Mate Chess</h1> {/* Logo i link do strony głównej */}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle /> {/* Przełącznik motywu jasny/ciemny */}
          <Button variant="ghost" size="icon" onClick={toggleMusic}>
            {isPlaying ? <Volume2 /> : <VolumeOff />} {/* Ikona dźwięku zależna od stanu odtwarzania */}
          </Button>
        </div>
      </div>
      {/* Sekcja wyszukiwania - wyświetlana tylko, gdy nie jest ukryta */}
      {hideNavbar ? null : (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> {/* Ikona wyszukiwania */}
            <Input placeholder="Search games, players..." className="pl-8" /> {/* Pole wyszukiwania */}
          </div>
        </div>
      )}
    </header>
  )
}
