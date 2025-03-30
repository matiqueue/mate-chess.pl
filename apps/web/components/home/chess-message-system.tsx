"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import { useState } from "react" // Hook React do zarządzania stanem
import { MessageSquare, Search, Send, Check, CheckCheck, Filter, PuzzleIcon as Chess, Trophy } from "lucide-react" // Ikony z biblioteki Lucide
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@workspace/ui/components/sheet" // Komponenty arkusza UI
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar" // Komponenty awatara UI
import { Input } from "@workspace/ui/components/input" // Komponent pola tekstowego UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs" // Komponenty zakładek UI
import { Badge } from "@workspace/ui/components/badge" // Komponent odznaki UI
import { Textarea } from "@workspace/ui/components/textarea" // Komponent obszaru tekstowego UI

/**
 * ChessMessageSystem
 *
 * Komponent systemu wiadomości szachowych wyświetlający interaktywny panel boczny (Sheet)
 * z wiadomościami od innych graczy. Obsługuje filtrowanie, wyszukiwanie, oznaczanie jako
 * przeczytane i wysyłanie nowych wiadomości. Używa zakładek do kategoryzacji wiadomości.
 *
 * @returns {JSX.Element} Element JSX reprezentujący system wiadomości szachowych.
 *
 * @remarks
 * Komponent zawiera statyczną listę wiadomości jako dane przykładowe. W rzeczywistej
 * aplikacji dane byłyby pobierane z backendu. Stylizacja i interaktywność opierają się
 * na komponentach UI z biblioteki @workspace/ui.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export default function ChessMessageSystem() {
  // Stan określający aktywną zakładkę (all, active, challenges, friends)
  const [activeTab, setActiveTab] = useState("all")
  // Stan przechowujący listę wiadomości
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "GrandMaster42",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Great game yesterday! Your Sicilian Defense was impressive. Want a rematch tonight?",
      time: "10:30 AM",
      date: "Today",
      read: false,
      category: "challenges",
      rating: 2145,
    },
    {
      id: 2,
      sender: "ChessQueen88",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "I noticed you used the Queen's Gambit in our last match. I've been studying some counters. Ready to test them?",
      time: "10:35 AM",
      date: "Today",
      read: false,
      category: "active",
      rating: 1876,
    },
    {
      id: 3,
      sender: "KnightRider",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Your move in our current game is brilliant! I didn't see that knight sacrifice coming. Well played!",
      time: "10:40 AM",
      date: "Today",
      read: true,
      category: "active",
      rating: 1950,
    },
    {
      id: 4,
      sender: "PawnStar",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Hey! I'm organizing a blitz tournament this weekend. 5 min games, 10 players so far. Interested in joining?",
      time: "Yesterday",
      date: "Yesterday",
      read: true,
      category: "friends",
      rating: 1788,
    },
    {
      id: 5,
      sender: "BishopBoss",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "I've analyzed our last game and found a critical moment on move 24. Let's discuss it when you have time.",
      time: "Yesterday",
      date: "Yesterday",
      read: true,
      category: "active",
      rating: 2034,
    },
    {
      id: 6,
      sender: "RookieMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Thanks for the chess lesson yesterday! Your explanation of endgame principles really helped. Can we schedule another session?",
      time: "2 days ago",
      date: "Monday",
      read: true,
      category: "friends",
      rating: 1456,
    },
    {
      id: 7,
      sender: "CheckmateCrusher",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "I challenge you to a match! Classical time control, 30 minutes + 10 second increment. Are you up for it?",
      time: "3 days ago",
      date: "Sunday",
      read: true,
      category: "challenges",
      rating: 1899,
    },
  ])

  // Stan przechowujący treść nowej wiadomości
  const [newMessage, setNewMessage] = useState("")
  // Stan przechowujący zapytanie wyszukiwania
  const [searchQuery, setSearchQuery] = useState("")
  // Stan określający, czy aktywny jest tryb pisania wiadomości
  const [composeMode, setComposeMode] = useState(false)

  // Obliczenie liczby nieprzeczytanych wiadomości
  const unreadCount = messages.filter((msg) => !msg.read).length

  // Filtrowanie wiadomości na podstawie aktywnej zakładki i zapytania wyszukiwania
  const filteredMessages = messages.filter((message) => {
    // Filtrowanie według zakładki
    if (activeTab !== "all" && message.category !== activeTab) return false

    // Filtrowanie według wyszukiwania (sender lub content)
    if (searchQuery && !message.content.toLowerCase().includes(searchQuery.toLowerCase()) && !message.sender.toLowerCase().includes(searchQuery.toLowerCase()))
      return false

    return true // Wiadomość spełnia kryteria
  })

  /**
   * markAsRead
   *
   * Oznacza wiadomość o podanym ID jako przeczytaną, aktualizując jej stan w tablicy wiadomości.
   *
   * @param {number} id - ID wiadomości do oznaczenia jako przeczytanej.
   */
  const markAsRead = (id: number) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)))
  }

  /**
   * handleSendMessage
   *
   * Obsługuje wysyłanie nowej wiadomości. W tej wersji wyświetla alert, ale w rzeczywistej
   * aplikacji wywołałoby zapytanie do backendu.
   */
  const handleSendMessage = () => {
    if (!newMessage.trim()) return // Wyjście, jeśli wiadomość jest pusta

    alert(`Message sent: ${newMessage}`) // Tymczasowy alert zamiast wysyłki
    setNewMessage("") // Reset treści wiadomości
    setComposeMode(false) // Wyłączenie trybu pisania
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
    <Sheet>
      {/* Przycisk otwierający panel wiadomości */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" /> {/* Ikona wiadomości */}
          <span className="sr-only">Chess Messages</span> {/* Tekst dla czytników ekranu */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount} {/* Liczba nieprzeczytanych wiadomości */}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        {/* Nagłówek panelu */}
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Chess className="h-5 w-5 text-primary" /> {/* Ikona szachów */}
              <SheetTitle className="text-xl">Mate-Chess Messages</SheetTitle> {/* Tytuł panelu */}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setComposeMode(true)}>
                <Send className="h-4 w-4" /> {/* Przycisk nowej wiadomości */}
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
              placeholder="Search players or messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Aktualizacja zapytania wyszukiwania
            />
          </div>
        </SheetHeader>

        {/* Tryb pisania wiadomości */}
        {composeMode ? (
          <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">To Player:</label>
              <Input placeholder="Enter username or search players" /> {/* Pole odbiorcy */}
            </div>
            <div className="flex-grow mb-4">
              <label className="text-sm font-medium mb-1 block">Message:</label>
              <Textarea
                placeholder="Type your message here..."
                className="h-[calc(100%-30px)]"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)} // Aktualizacja treści wiadomości
              />
            </div>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Chess className="mr-2 h-4 w-4" />
                Send Game Invite {/* Przycisk zaproszenia do gry */}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Trophy className="mr-2 h-4 w-4" />
                Share Game Analysis {/* Przycisk udostępnienia analizy */}
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setComposeMode(false)}>
                Cancel {/* Anulowanie pisania */}
              </Button>
              <Button onClick={handleSendMessage}>Send Message</Button> {/* Wysłanie wiadomości */}
            </div>
          </div>
        ) : (
          <>
            {/* Zakładki wiadomości */}
            <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All
                  <Badge variant="secondary" className="ml-2">
                    {messages.length} {/* Liczba wszystkich wiadomości */}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active Games
                  <Badge variant="secondary" className="ml-2">
                    {messages.filter((m) => m.category === "active").length} {/* Liczba aktywnych gier */}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="challenges">
                  Challenges
                  <Badge variant="secondary" className="ml-2">
                    {messages.filter((m) => m.category === "challenges").length} {/* Liczba wyzwań */}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="friends">
                  Friends
                  <Badge variant="secondary" className="ml-2">
                    {messages.filter((m) => m.category === "friends").length} {/* Liczba wiadomości od znajomych */}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Zawartość zakładki "all" */}
              <TabsContent value="all" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-lg border p-4 transition-colors hover:bg-accent/50 cursor-pointer ${!message.read ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => markAsRead(message.id)} // Oznaczanie jako przeczytane po kliknięciu
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-muted">
                          <AvatarImage src={message.avatar} alt={message.sender} />
                          <AvatarFallback>{message.sender.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${!message.read ? "text-primary" : ""}`}>
                                {message.sender} {/* Nazwa nadawcy */}
                              </span>
                              <span className={`text-xs ${getRatingColor(message.rating)}`}>
                                {message.rating} {/* Ranking ELO */}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {message.read ? <CheckCheck className="h-3 w-3 text-primary" /> : <Check className="h-3 w-3" />}
                              <span>{message.time}</span> {/* Czas wiadomości */}
                            </div>
                          </div>
                          <p className={`text-sm line-clamp-2 ${!message.read ? "font-medium" : "text-muted-foreground"}`}>
                            {message.content} {/* Treść wiadomości (max 2 linie) */}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                message.category === "challenges"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : message.category === "active"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                              }`}
                            >
                              {message.category === "challenges" ? "Challenge" : message.category === "active" ? "Active Game" : "Friend"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{message.date}</span> {/* Data wiadomości */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Chess className="mx-auto h-10 w-10 mb-2 opacity-20" /> {/* Ikona szachów */}
                    <p>No chess messages found</p> {/* Komunikat o braku wiadomości */}
                  </div>
                )}
              </TabsContent>

              {/* Pozostałe zakładki - zawartość filtrowana przez filteredMessages */}
              <TabsContent value="active" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {/* Wiadomości dla aktywnych gier */}
              </TabsContent>
              <TabsContent value="challenges" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {/* Wiadomości dla wyzwań */}
              </TabsContent>
              <TabsContent value="friends" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {/* Wiadomości od znajomych */}
              </TabsContent>
            </Tabs>

            {/* Stopka panelu */}
            <SheetFooter className="mt-6 border-t pt-4 flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setComposeMode(true)}>
                <Send className="mr-2 h-4 w-4" />
                New Message {/* Przycisk nowej wiadomości */}
              </Button>
              <Button variant="default" className="w-full sm:w-auto">
                <Chess className="mr-2 h-4 w-4" />
                Challenge to a Game {/* Przycisk wyzwania */}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
