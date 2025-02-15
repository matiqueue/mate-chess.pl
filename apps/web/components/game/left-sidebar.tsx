"use client"

import { Button } from "@workspace/ui/components/button"
import { Users, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Activity, Settings, PuzzleIcon, Home, Bot, GraduationCap } from "lucide-react"
import { useTheme } from "next-themes"
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from "@workspace/ui/components/sidebar"

export function LeftSidebar() {
  const { theme } = useTheme()
  const { open } = useSidebar() // Pobieramy stan otwarcia sidebaru

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900"
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600"
  const borderColor = isDark ? "border-white/10" : "border-zinc-200"

  // Warunkowe style dla przycisków
  const buttonClass = open
    ? `w-full flex items-center justify-start px-2 ${textColor} hover:bg-white/10`
    : `w-full flex items-center justify-center ${textColor} hover:bg-white/10`

  // Warunkowe style dla ikon przycisków
  const iconClass = open ? "mr-2 h-4 w-4" : "h-4 w-4"

  // Warunkowe style dla nagłówka (logo)
  const headerClass = open
    ? `text-2xl font-bold flex items-center justify-start gap-2 ${textColor}`
    : `text-2xl font-bold flex items-center justify-center ${textColor}`

  // Stały rozmiar dla ikony logo – niezależnie od stanu sidebaru
  const titleIconClass = "h-6 w-6 flex-none"

  function Header() {
    return (
      <SidebarHeader className="p-6 text-center">
        <h1 className={headerClass}>
          <PuzzleIcon className={titleIconClass} />
          {open && "Mate Chess"}
        </h1>
      </SidebarHeader>
    )
  }

  return (
    <Sidebar
      collapsible="icon"
      // Szerokość sidebaru zależy od stanu: 16rem gdy otwarty, 4rem gdy collapsed
      style={{ width: open ? "16rem" : "4rem" }}
      className={`flex flex-col border-r ${borderColor} bg-background/30 backdrop-blur-sm rounded-tr-2xl rounded-br-2xl`}
    >
      {open && <Header />}
      <SidebarContent className="flex-1 p-4 space-y-4">
        <Link href="/home">
          <Button variant="ghost" className={buttonClass}>
            <Home className={iconClass} />
            {open && "Home"}
          </Button>
        </Link>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>PLAY</h2>}
          <div className="space-y-1">
            <Button variant="ghost" className={buttonClass}>
              <Users className={iconClass} />
              {open && "Play Online"}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <Bot className={iconClass} />
              {open && "Play vs Bot"}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <Trophy className={iconClass} />
              {open && "Tournaments"}
            </Button>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>LEARN</h2>}
          <div className="space-y-1">
            <Button variant="ghost" className={buttonClass}>
              <PuzzlePiece className={iconClass} />
              {open && "Puzzles"}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <GraduationCap className={iconClass} />
              {open && "Lessons"}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <BookOpen className={iconClass} />
              {open && "Openings"}
            </Button>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>COMMUNITY</h2>}
          <div className="space-y-1">
            <Button variant="ghost" className={buttonClass}>
              <Users className={iconClass} />
              {open && "Players"}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <Activity className={iconClass} />
              {open && "Activity"}
            </Button>
          </div>
        </div>
      </SidebarContent>

      <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

      <SidebarFooter className="p-4">
        <Button variant="ghost" className={buttonClass}>
          <Settings className={iconClass} />
          {open && "Settings"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
