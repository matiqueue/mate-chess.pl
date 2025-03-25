"use client"

import { useState } from "react"
import { Bell, Search, Filter, Check, CheckCheck, Trophy, Users, Clock, PuzzleIcon as Chess, Award, Star } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Badge } from "@workspace/ui/components/badge"

export default function ChessNotifications() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

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

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (activeTab !== "all" && notification.type !== activeTab) return false

    // Filter by search
    if (
      searchQuery &&
      !notification.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.sender.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  // Function to get notification type color
  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "challenge":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "game":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "friend":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "tournament":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "achievement":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return ""
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <SheetTitle className="text-xl">Notifications</SheetTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notifications..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="game">
              Games
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "game").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="challenge">
              Challenges
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "challenge").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="tournament">
              Tournaments
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "tournament").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 transition-colors hover:bg-accent/50 ${!notification.read ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getNotificationTypeColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${!notification.read ? "text-primary" : ""}`}>{notification.title}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {notification.read ? <CheckCheck className="h-3 w-3 text-primary" /> : <Check className="h-3 w-3" />}
                          <span>{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{notification.sender}</span> {notification.content}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className={`text-xs ${getNotificationTypeColor(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          {notification.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Bell className="mx-auto h-10 w-10 mb-2 opacity-20" />
                <p>No notifications found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="game" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {/* Game notifications will be shown here through the filtered list */}
          </TabsContent>

          <TabsContent value="challenge" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {/* Challenge notifications will be shown here through the filtered list */}
          </TabsContent>

          <TabsContent value="tournament" className="mt-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {/* Tournament notifications will be shown here through the filtered list */}
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6 border-t pt-4">
          <Button variant="outline" className="w-full">
            Settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
