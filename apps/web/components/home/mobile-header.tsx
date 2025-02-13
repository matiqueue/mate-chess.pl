"use client"

import { Search, Volume2, VolumeOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@workspace/ui/components/mode-toggle"
import { Button } from "@workspace/ui/components/button"
import { useAudio } from "./audio-provider"

type MobileHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function MobileHeader({ className }: MobileHeaderProps) {
  const pathname = usePathname()
  const { isPlaying, toggleMusic } = useAudio()

  const hideNavbar = pathname.startsWith("/play/online/") || pathname.startsWith("/play/link/")
  return (
    <header className={cn("flex flex-col border-b", className)}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <Link href="/home">
            <h1 className="ml-4 text-xl font-bold text-foreground">Mate Chess</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMusic}>
            {isPlaying ? <Volume2 /> : <VolumeOff />}
          </Button>
        </div>
      </div>
      {hideNavbar ? null : (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search games, players..." className="pl-8" />
          </div>
        </div>
      )}
    </header>
  )
}
