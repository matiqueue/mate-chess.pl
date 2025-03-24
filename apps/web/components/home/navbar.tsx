"use client"

import type React from "react"
import { Button } from "@workspace/ui/components/button"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { ModeToggle } from "@workspace/ui/components/mode-toggle"
import { Volume2, VolumeOff } from "lucide-react"
import { useAudio } from "@/components/home/audio-provider"
import { LanguageSwitcher } from "./language-switcher"
import { useTranslation } from "react-i18next"
import ChessMessageSystem from "./chess-message-system"
import ChessNotifications from "./chess-notifications"
import EnhancedSearch from "./enhanced-search"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"

type NavbarProps = React.HTMLAttributes<HTMLElement>

export function Navbar({ className }: NavbarProps) {
  const { isPlaying, toggleMusic } = useAudio()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className={cn("w-full h-16 border-b px-6 flex items-center gap-6 bg-sidebar", className)}>
      <SidebarTrigger />

      <EnhancedSearch className="flex-1 max-w-sm" />

      <div className="flex items-center gap-4">
        <ChessNotifications />
        <ChessMessageSystem />
        <ModeToggle />

        <Button variant="ghost" size="icon" onClick={toggleMusic}>
          {isPlaying ? <Volume2 /> : <VolumeOff />}
        </Button>

        <LanguageSwitcher />
      </div>
    </header>
  )
}
