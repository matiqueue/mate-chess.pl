"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import { useState } from "react" // Hook React do zarządzania stanem
import { Bell, Search, Filter, Check, CheckCheck, Trophy, Users, Clock, PuzzleIcon as Chess, Award, Star } from "lucide-react" // Ikony z biblioteki Lucide
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@workspace/ui/components/sheet" // Komponenty arkusza UI
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Input } from "@workspace/ui/components/input" // Komponent pola tekstowego UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs" // Komponenty zakładek UI
import { Badge } from "@workspace/ui/components/badge" // Komponent odznaki UI

/**
 * ChessNotifications
 *
 * Komponent systemu powiadomień szachowych wyświetlający interaktywny panel boczny (Sheet)
 * z powiadomieniami dotyczącymi gier, wyzwań, turniejów i innych wydarzeń. Obsługuje
 * filtrowanie, wyszukiwanie oraz oznaczanie powiadomień jako przeczytane.
 *
 * @returns {JSX.Element} Element JSX reprezentujący system powiadomień szachowych.
 *
 * @remarks
 * Komponent zawiera statyczną listę powiadomień jako dane przykładowe. W rzeczywistej
 * aplikacji dane byłyby pobierane z backendu. Stylizacja i interaktywność opierają się
 * na komponentach UI z biblioteki @workspace/ui.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export default function ChessNotifications() {
  // Stan określający aktywną zakładkę (all, game, challenge, tournament)
  const [activeTab, setActiveTab] = useState("all")
  // Stan przechowujący zapytanie wyszukiwania
  const [searchQuery, setSearchQuery] = useState("")

  // Stan przechowujący listę powiadomień
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "challenge",
      title: "New Challenge",
      sender: "GrandMaster42",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Challenged you to a Blitz match (5+2)",
      time: "10 min ago",
      read: false,
      icon: Chess,
      action: "Accept Challenge",
    },
    {
      id: 2,
      type: "game",
      title: "Your Move",
      sender: "ChessQueen88",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "It's your turn in the current game",
      time: "30 min ago",
      read: false,
      icon: Clock,
      action: "Make Move",
    },
    {
      id: 3,
      type: "friend",
      title: "Friend Request",
      sender: "KnightRider",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Sent you a friend request",
      time: "1 hour ago",
      read: false,
      icon: Users,
      action: "Accept Request",
    },
    {
      id: 4,
      type: "tournament",
      title: "Tournament Invitation",
      sender: "Mate-Chess",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Weekend Rapid Tournament starts in 2 days",
      time: "3 hours ago",
      read: true,
      icon: Trophy,
      action: "Join Tournament",
    },
    {
      id: 5,
      type: "achievement",
      title: "Achievement Unlocked",
      sender: "Mate-Chess",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "You've won 10 games in a row! Earned 'Winning Streak' badge",
      time: "Yesterday",
      read: true,
      icon: Award,
      action: "View Achievements",
    },
    {
      id: 6,
      type: "game",
      title: "Game Completed",
      sender: "BishopBoss",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Your game has ended. Result: Victory!",
      time: "Yesterday",
      read: true,
      icon: Chess,
      action: "View Analysis",
    },
    {
      id: 7,
      type: "system",
      title: "Rating Update",
      sender: "Mate-Chess",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Your rating has increased by 15 points to 1845",
      time: "2 days ago",
      read: true,
      icon: Star,
      action: "View Stats",
    },
  ])

  // Obliczenie liczby nieprzeczytanych powiadomień
  const unreadCount = notifications.filter((notif) => !notif.read).length

  // Filtrowanie powiadomień na podstawie aktywnej zakładki i zapytania wyszukiwania
  const filteredNotifications = notifications.filter((notification) => {
    // Filtrowanie według zakładki
    if (activeTab !== "all" && notification.type !== activeTab) return false

    // Filtrowanie według wyszukiwania (sender lub content)
    if (
      searchQuery &&
      !notification.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.sender.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true // Powiadomienie spełnia kryteria
  })

  /**
   * markAsRead
   *
   * Oznacza powiadomienie o podanym ID jako przeczytane, aktualizując jego stan w tablicy powiadomień.
   *
   * @param {number} id - ID powiadomienia do oznaczenia jako przeczytanego.
   */
  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  /**
   * markAllAsRead
   *
   * Oznacza wszystkie powiadomienia jako przeczytane, aktualizując ich stan w tablicy powiadomień.
   */
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  /**
   * getNotificationTypeColor
   *
   * Zwraca klasę CSS dla koloru tła i tekstu na podstawie typu powiadomienia.
   *
   * @param {string} type - Typ powiadomienia (np. challenge, game).
   * @returns {string} Klasa CSS określająca styl kolorystyczny.
   */
  const getNotificationTypeColor = (type: string): string => {
    switch (type) {
      case "challenge":
        return "bg-amber-100 text-amber-800 border-amber-200" // Żółty dla wyzwań
      case "game":
        return "bg-emerald-100 text-emerald-800 border-emerald-200" // Zielony dla gier
      case "friend":
        return "bg-blue-100 text-blue-800 border-blue-200" // Niebieski dla znajomych
      case "tournament":
        return "bg-purple-100 text-purple-800 border-purple-200" // Fioletowy dla turniejów
      case "achievement":
        return "bg-pink-100 text-pink-800 border-pink-200" // Różowy dla osiągnięć
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200" // Szary dla systemowych
      default:
        return "" // Brak stylu dla nieznanych typów
    }
  }

  // Renderowanie komponentu
  return (
    <Sheet>
      {/* Przycisk otwierający panel powiadomień */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" /> {/* Ikona dzwonka */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount} {/* Liczba nieprzeczytanych powiadomień */}
            </span>
          )}
          <span className="sr-only">Notifications</span> {/* Tekst dla czytników ekranu */}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        {/* Nagłówek panelu */}
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> {/* Ikona dzwonka */}
              <SheetTitle className="text-xl">Notifications</SheetTitle> {/* Tytuł panelu */}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read {/* Przycisk oznaczania wszystkich jako przeczytane */}
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" /> {/* Przycisk filtrowania */}
              </Button>
            </div>
          </div>
          {/* Pole wyszukiwania */}
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> {/* Ikona wyszukiwania */}
            <Input
              placeholder="Search notifications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Aktualizacja zapytania wyszukiwania
            />
          </div>
        </SheetHeader>

        {/* Zakładki powiadomień */}
        <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length} {/* Liczba wszystkich powiadomień */}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="game">
              Games
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "game").length} {/* Liczba powiadomień o grach */}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="challenge">
              Challenges
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "challenge").length} {/* Liczba wyzwań */}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="tournament">
              Tournaments
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "tournament").length} {/* Liczba turniejów */}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Zawartość zakładki "all" */}
          <TabsContent value="all" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 transition-colors hover:bg-accent/50 ${!notification.read ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => markAsRead(notification.id)} // Oznaczanie jako przeczytane po kliknięciu
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getNotificationTypeColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" /> {/* Dynamiczna ikona */}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                          {notification.title} {/* Tytuł powiadomienia */}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {notification.read ? <CheckCheck className="h-3 w-3 text-primary" /> : <Check className="h-3 w-3" />}
                          <span>{notification.time}</span> {/* Czas powiadomienia */}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{notification.sender}</span> {notification.content} {/* Treść powiadomienia */}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className={`text-xs ${getNotificationTypeColor(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} {/* Typ powiadomienia */}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          {notification.action} {/* Akcja powiadomienia */}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Bell className="mx-auto h-10 w-10 mb-2 opacity-20" /> {/* Ikona dzwonka */}
                <p>No notifications found</p> {/* Komunikat o braku powiadomień */}
              </div>
            )}
          </TabsContent>

          {/* Pozostałe zakładki - zawartość filtrowana przez filteredNotifications */}
          <TabsContent value="game" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {/* Powiadomienia o grach */}
          </TabsContent>
          <TabsContent value="challenge" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {/* Powiadomienia o wyzwaniach */}
          </TabsContent>
          <TabsContent value="tournament" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {/* Powiadomienia o turniejach */}
          </TabsContent>
        </Tabs>

        {/* Stopka panelu */}
        <SheetFooter className="mt-6 border-t pt-4">
          <Button variant="outline" className="w-full">
            Settings {/* Przycisk ustawień */}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
