"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useUser } from "@clerk/nextjs"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, PlayCircle, PuzzleIcon as PuzzlePiece, Bot, GraduationCap, Trophy, Users, BookOpen, Activity, Settings, Send } from "lucide-react"

import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@workspace/ui/components/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface NavItemProps {
  href: string
  icon: typeof Home
  children: React.ReactNode
  badge?: string
}

function NavItem({ href, icon: Icon, children, badge }: NavItemProps) {
  return (
    <Link href={href} className="flex items-center justify-between px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <Icon size={20} />
        <span>{children}</span>
      </div>
      {badge && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{badge}</span>}
    </Link>
  )
}

/**
 * Komponent chatu, który przenosimy do sidebaru minimalnego.
 * Został lekko zmodyfikowany, żeby pasował do szerszych stylów sidebara.
 */
function ChatSidebar() {
  const { isSignedIn, user } = useUser()
  const params = useParams()
  // Przyjmujemy, że id pokoju jest przekazywane w ścieżce, np. /play/online/[id]
  const roomId = params.id as string

  const [messages, setMessages] = useState<{ sender: string; text: string; imageUrl: string }[]>([])
  const [input, setInput] = useState("")
  const [cooldown, setCooldown] = useState<number>(0)
  const socketRef = useRef<Socket | null>(null)
  const lastSentRef = useRef<number>(0)

  useEffect(() => {
    if (!isSignedIn || !user) return

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000")
      socketRef.current.emit("joinRoom", roomId)
    }

    socketRef.current.on("chatHistory", (data: typeof messages) => {
      setMessages(data)
    })

    socketRef.current.on("receiveMessage", (message: (typeof messages)[0]) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [isSignedIn, user, roomId])

  // Licznik cooldownu
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown((prev) => Math.max(prev - 1, 0))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const sendMessage = () => {
    if (input.trim() === "") return

    const now = Date.now()
    if (now - lastSentRef.current < 2000) {
      setCooldown(Math.ceil((2000 - (now - lastSentRef.current)) / 1000))
      return
    }
    lastSentRef.current = now

    const message = {
      sender: user?.firstName || "Player",
      text: input,
      imageUrl: user?.imageUrl || "https://via.placeholder.com/40",
    }

    socketRef.current?.emit("sendMessage", { roomId, message })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Game Chat</h1>
      <Card className="p-2">
        <ScrollArea className="max-h-[40vh] space-y-3 overflow-y-auto">
          {messages.map((msg, index) => (
            <CardContent key={index} className="flex gap-2 items-center p-2 border rounded-lg shadow-md">
              <Avatar>
                <AvatarImage src={msg.imageUrl || "https://via.placeholder.com/40"} />
                <AvatarFallback>{msg.sender[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{msg.sender}</p>
                <p className="text-sm text-gray-600">{msg.text}</p>
              </div>
            </CardContent>
          ))}
        </ScrollArea>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button onClick={sendMessage} className="px-3 py-2 bg-white text-black rounded-md shadow-md border">
              <Send size={20} color="black" />
            </Button>
          </div>
          {cooldown > 0 && (
            <p className="text-xs text-red-600">
              Next message can be sent in {cooldown} second{cooldown > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const clerk = useClerk()

  // Jeśli dokładnie "/play/online" lub "/play/link" – nie renderujemy sidebaru
  if (pathname === "/play/online" || pathname === "/play/link") {
    return null
  }

  // Jeśli jesteśmy na podstronach "/play/online/*" lub "/play/link/*" – renderujemy minimalny sidebar z chatem
  if (pathname.startsWith("/play/online/") || pathname.startsWith("/play/link/")) {
    return (
      <ShadcnSidebar>
        <SidebarHeader className="p-6">
          <Link href="/home">
            <div className="flex items-center gap-2">
              <PuzzlePiece className="h-6 w-6" />
              <h1 className="text-xl font-bold">Mate Chess</h1>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <ChatSidebar />
        </SidebarContent>
      </ShadcnSidebar>
    )
  }

  // W pozostałych przypadkach (np. na "/play") renderujemy pełny sidebar
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/clearCookie", {
        method: "POST",
      })
    } catch (error) {
      console.error("Błąd przy czyszczeniu ciasteczka:", error)
    }
    // Przekierowanie na stronę główną
    router.push("/")
  }

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-6">
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-2">
            <PuzzlePiece className="h-6 w-6" />
            <h1 className="text-xl font-bold">Mate Chess</h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <div>
              <NavItem href="/home" icon={Home}>
                Home
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">PLAY</h2>
              </div>
              <NavItem href="/play" icon={PlayCircle} badge="Live">
                Play Online
              </NavItem>
              <NavItem href="/bot" icon={Bot}>
                Play vs Bot
              </NavItem>
              <NavItem href="/tournaments" icon={Trophy}>
                Tournaments
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">LEARN</h2>
              </div>
              <NavItem href="/puzzles" icon={PuzzlePiece} badge="Daily">
                Puzzles
              </NavItem>
              <NavItem href="/lessons" icon={GraduationCap}>
                Lessons
              </NavItem>
              <NavItem href="/openings" icon={BookOpen}>
                Openings
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">COMMUNITY</h2>
              </div>
              <NavItem href="/players" icon={Users}>
                Players
              </NavItem>
              <NavItem href="/activity" icon={Activity}>
                Activity
              </NavItem>
            </div>

            <Separator className="mx-6" />

            <div>
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton>
              <Button variant="outline">Login</Button>
            </SignInButton>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Offline</span>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Stats</DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => clerk.signOut()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </SignedIn>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
