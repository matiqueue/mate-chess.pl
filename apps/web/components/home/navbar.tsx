"use client"

import React from "react"
import { Bell, MessageSquare, Search } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { ModeToggle } from "@workspace/ui/components/mode-toggle"
import { Volume2, VolumeOff } from "lucide-react"
import { useAudio } from "@/components/home/audio-provider"
import { LanguageSwitcher } from "./language-switcher"

type NavbarProps = React.HTMLAttributes<HTMLElement>

export function Navbar({ className }: NavbarProps) {
  const { isPlaying, toggleMusic } = useAudio()

  return (
    <header className={cn("w-full h-16 border-b px-6 flex items-center gap-6 bg-sidebar", className)}>
      <SidebarTrigger />

      <form className="flex-1 flex max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 mx-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search games, players..." className="h-10 pl-10" />
        </div>
      </form>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Messages</span>
        </Button>
        <ModeToggle />

        <Button variant="ghost" size="icon" onClick={toggleMusic}>
          {isPlaying ? <Volume2 /> : <VolumeOff />}
        </Button>

        <LanguageSwitcher />
      </div>
    </header>
  )
}
