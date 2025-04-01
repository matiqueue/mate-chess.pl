"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import type React from "react" // Import typu React dla typowania

import { useState, useRef, useEffect } from "react" // Hooki React do zarządzania stanem, referencjami i efektami
import { Search, User, DiamondIcon as ChessIcon, BookOpen, ArrowRight, Trophy, X } from "lucide-react" // Ikony z biblioteki Lucide
import { Input } from "@workspace/ui/components/input" // Komponent pola tekstowego UI
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar" // Komponenty awatara UI
import { Badge } from "@workspace/ui/components/badge" // Komponent odznaki UI
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import { cn } from "@workspace/ui/lib/utils" // Util do łączenia klas CSS

/**
 * EnhancedSearch
 *
 * Komponent zaawansowanego wyszukiwania wyświetlający pole wyszukiwania z rozwijanymi
 * wynikami dla stron, graczy i gier. Obsługuje filtrowanie w czasie rzeczywistym,
 * zamykanie wyników kliknięciem poza obszarem oraz tłumaczenia.
 *
 * @param {Object} props - Właściwości komponentu.
 * @param {string} [props.className] - Opcjonalna klasa CSS dla stylizacji nadrzędnej.
 * @returns {JSX.Element} Element JSX reprezentujący wyszukiwarkę.
 *
 * @remarks
 * Komponent używa statycznych danych przykładowych dla stron, graczy i gier. W rzeczywistej
 * aplikacji dane byłyby pobierane z backendu. Wyniki są ograniczone do 3 pozycji w każdej
 * kategorii dla lepszej czytelności.
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 * @source Własna implementacja
 */
export default function EnhancedSearch({ className }: { className?: string }) {
  // Hook do tłumaczeń
  const { t } = useTranslation()
  // Stan przechowujący zapytanie wyszukiwania
  const [searchQuery, setSearchQuery] = useState("")
  // Stan wskazujący, czy trwa wyszukiwanie
  const [isSearching, setIsSearching] = useState(false)
  // Stan kontrolujący widoczność wyników
  const [showResults, setShowResults] = useState(false)
  // Referencja do kontenera wyszukiwania
  const searchRef = useRef<HTMLDivElement>(null)

  // Przykładowe dane dla wyników wyszukiwania
  const pages = [
    { id: 1, title: "Dashboard", path: "/dashboard", icon: BookOpen },
    { id: 2, title: "Game Analysis", path: "/analysis", icon: ChessIcon },
    { id: 3, title: "Tournaments", path: "/tournaments", icon: Trophy },
    { id: 4, title: "Learning Center", path: "/learn", icon: BookOpen },
    { id: 5, title: "Profile Settings", path: "/settings", icon: User },
  ]

  const players = [
    { id: 1, name: "GrandMaster42", rating: 2145, avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    { id: 2, name: "ChessQueen88", rating: 1876, avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    { id: 3, name: "KnightRider", rating: 1950, avatar: "/placeholder.svg?height=40&width=40", status: "offline" },
    { id: 4, name: "PawnStar", rating: 1788, avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    { id: 5, name: "BishopBoss", rating: 2034, avatar: "/placeholder.svg?height=40&width=40", status: "offline" },
  ]

  const games = [
    { id: 1, white: "GrandMaster42", black: "ChessQueen88", result: "1-0", date: "Today", type: "Blitz" },
    { id: 2, white: "You", black: "KnightRider", result: "0-1", date: "Yesterday", type: "Rapid" },
    { id: 3, white: "BishopBoss", black: "You", result: "½-½", date: "2 days ago", type: "Classical" },
    { id: 4, white: "PawnStar", black: "RookieMaster", result: "1-0", date: "3 days ago", type: "Bullet" },
  ]

  // Filtrowanie wyników na podstawie zapytania wyszukiwania
  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredGames = games.filter(
    (game) =>
      game.white.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.black.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Efekt obsługujący kliknięcie poza obszarem wyszukiwania
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false) // Zamykanie wyników
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside) // Czyszczenie zdarzenia przy odmontowaniu
    }
  }, [])

  /**
   * handleSearchChange
   *
   * Obsługuje zmianę wartości w polu wyszukiwania, aktualizując stan i kontrolując widoczność wyników.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Zdarzenie zmiany w polu tekstowym.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      setIsSearching(true) // Włączenie trybu wyszukiwania
      setShowResults(true) // Wyświetlenie wyników
    } else {
      setIsSearching(false) // Wyłączenie trybu wyszukiwania
      setShowResults(false) // Ukrycie wyników
    }
  }

  /**
   * getRatingColor
   *
   * Zwraca klasę CSS dla koloru tekstu na podstawie rankingu ELO gracza.
   *
   * @param {number} rating - Ranking ELO gracza.
   * @returns {string} Klasa CSS określająca kolor tekstu.
   */
  const getRatingColor = (rating: number): string => {
    if (rating >= 2200) return "text-amber-500 font-bold" // Złoty dla mistrzów
    if (rating >= 1900) return "text-emerald-500" // Zielony dla ekspertów
    if (rating >= 1600) return "text-blue-500" // Niebieski dla średniozaawansowanych
    return "text-gray-500" // Szary dla początkujących
  }

  // Renderowanie komponentu
  return (
    <div className={cn("relative flex-1", className)} ref={searchRef}>
      {/* Pole wyszukiwania */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 mx-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> {/* Ikona wyszukiwania */}
        <Input
          placeholder={t("searchNavbar")} // Tłumaczony placeholder
          className="h-10 pl-10"
          value={searchQuery}
          onChange={handleSearchChange} // Obsługa zmiany tekstu
          onFocus={() => {
            if (searchQuery.length > 0) setShowResults(true) // Wyświetlenie wyników przy fokusie, jeśli jest zapytanie
          }}
        />
        {isSearching && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => {
              setSearchQuery("") // Czyszczenie zapytania
              setIsSearching(false) // Wyłączenie trybu wyszukiwania
              setShowResults(false) // Ukrycie wyników
            }}
          >
            <span className="sr-only">Clear search</span> {/* Tekst dla czytników ekranu */}
            <X className="h-4 w-4" /> {/* Ikona "X" */}
          </Button>
        )}
      </div>

      {/* Wyniki wyszukiwania */}
      {showResults && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-background shadow-lg">
          <div className="p-4">
            {searchQuery.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-2">Start typing to search</div> // Komunikat przy pustym zapytaniu
            ) : (
              <>
                {/* Sekcja stron */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Pages</h3>
                  {filteredPages.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPages.slice(0, 3).map((page) => (
                        <a key={page.id} href={page.path} className="flex items-center gap-2 rounded-md p-2 hover:bg-accent">
                          <page.icon className="h-4 w-4 text-muted-foreground" /> {/* Dynamiczna ikona */}
                          <span>{page.title}</span> {/* Tytuł strony */}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">No pages found</div> // Komunikat o braku stron
                  )}
                </div>

                {/* Sekcja graczy */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Players</h3>
                  {filteredPlayers.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPlayers.slice(0, 3).map((player) => (
                        <a key={player.id} href={`/player/${player.id}`} className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={player.avatar} alt={player.name} />
                              <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{player.name}</span> {/* Nazwa gracza */}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${getRatingColor(player.rating)}`}>{player.rating}</span> {/* Ranking ELO */}
                            <Badge
                              variant="outline"
                              className={`text-xs ${player.status === "online" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {player.status} {/* Status gracza */}
                            </Badge>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">No players found</div> // Komunikat o braku graczy
                  )}
                </div>

                {/* Sekcja gier */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium mb-2">Games</h3>
                  {filteredGames.length > 0 ? (
                    <div className="space-y-2">
                      {filteredGames.slice(0, 3).map((game) => (
                        <a key={game.id} href={`/game/${game.id}`} className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{game.white}</span> {/* Gracz białych */}
                            <span className="text-xs text-muted-foreground mx-1">vs</span>
                            <span className="text-sm">{game.black}</span> {/* Gracz czarnych */}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {game.type}
                            </Badge>{" "}
                            {/* Typ gry */}
                            <span className="text-xs font-medium">{game.result}</span> {/* Wynik gry */}
                            <span className="text-xs text-muted-foreground">{game.date}</span> {/* Data gry */}
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">No games found</div> // Komunikat o braku gier
                  )}
                </div>
              </>
            )}
          </div>

          {/* Przycisk "View all results" */}
          <div className="border-t p-2">
            <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
              <Search className="mr-2 h-4 w-4" />
              View all results
              <ArrowRight className="ml-auto h-4 w-4" /> {/* Strzałka w prawo */}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
