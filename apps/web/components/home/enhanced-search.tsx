"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, User, DiamondIcon as ChessIcon, BookOpen, ArrowRight, Trophy, X } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { useTranslation } from "react-i18next"
import { cn } from "@workspace/ui/lib/utils"

export default function EnhancedSearch({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Sample data for search results
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

  // Filter results based on search query
  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredGames = games.filter(
    (game) =>
      game.white.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.black.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      setIsSearching(true)
      setShowResults(true)
    } else {
      setIsSearching(false)
      setShowResults(false)
    }
  }

  // Function to get rating color based on ELO
  const getRatingColor = (rating: number) => {
    if (rating >= 2200) return "text-amber-500 font-bold" // Gold for masters
    if (rating >= 1900) return "text-emerald-500" // Green for experts
    if (rating >= 1600) return "text-blue-500" // Blue for intermediate
    return "text-gray-500" // Gray for beginners
  }

  return (
    <div className={cn("relative flex-1", className)} ref={searchRef}>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 mx-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchNavbar")}
          className="h-10 pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchQuery.length > 0) {
              setShowResults(true)
            }
          }}
        />
        {isSearching && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => {
              setSearchQuery("")
              setIsSearching(false)
              setShowResults(false)
            }}
          >
            <span className="sr-only">Clear search</span>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border bg-background shadow-lg">
          <div className="p-4">
            {searchQuery.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-2">Start typing to search</div>
            ) : (
              <>
                {/* Pages Section */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Pages</h3>
                  {filteredPages.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPages.slice(0, 3).map((page) => (
                        <a key={page.id} href={page.path} className="flex items-center gap-2 rounded-md p-2 hover:bg-accent">
                          <page.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{page.title}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">No pages found</div>
                  )}
                </div>

                {/* Players Section */}
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
                            <span>{player.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${getRatingColor(player.rating)}`}>{player.rating}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${player.status === "online" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {player.status}
                            </Badge>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">No players found</div>
                  )}
                </div>

                {/* Games Section */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium mb-2">Games</h3>
                  {filteredGames.length > 0 ? (
                    <div className="space-y-2">
                      {filteredGames.slice(0, 3).map((game) => (
                        <a key={game.id} href={`/game/${game.id}`} className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{game.white}</span>
                            <span className="text-xs text-muted-foreground mx-1">vs</span>
                            <span className="text-sm">{game.black}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {game.type}
                            </Badge>
                            <span className="text-xs font-medium">{game.result}</span>
                            <span className="text-xs text-muted-foreground">{game.date}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">No games found</div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="border-t p-2">
            <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
              <Search className="mr-2 h-4 w-4" />
              View all results
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
