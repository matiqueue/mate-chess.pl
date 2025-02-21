"use client"

import { Button } from "@workspace/ui/components/button"
import { Users, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Activity, Settings, PuzzleIcon, Home, Bot, GraduationCap } from "lucide-react"
import { useTheme } from "next-themes"
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from "@workspace/ui/components/sidebar"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export function LeftSidebar() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { open, setOpen } = useSidebar()

  // Przy montowaniu odczytujemy stan z localStorage i ustawiamy go tylko, gdy się różni
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarOpen")
    if (storedState !== null) {
      const value = storedState === "true"
      if (open !== value) {
        setOpen(value)
      }
    }
    // Uruchamiamy efekt tylko przy montowaniu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Za każdym razem, gdy stan 'open' ulega zmianie, zapisujemy go w localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", open.toString())
  }, [open])

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
          {open && t("sidebar.brandName")}
        </h1>
      </SidebarHeader>
    )
  }

  const navItems = [
    { name: t("sidebar.play"), href: "/play" },
    { name: t("sidebar.learn"), href: "/learn" },
    { name: t("sidebar.puzzles"), href: "/puzzles" },
    { name: t("sidebar.community"), href: "/community" },
  ]

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
            {open && t("sidebar.home")}
          </Button>
        </Link>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && (
            <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>
              {t("sidebar.playSection")}
            </h2>
          )}
          <div className="space-y-1">
            <Button variant="ghost" className={buttonClass}>
              <Users className={iconClass} />
              {open && t("sidebar.playOnline")}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <Bot className={iconClass} />
              {open && t("sidebar.playVsBot")}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <Trophy className={iconClass} />
              {open && t("sidebar.tournaments")}
            </Button>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && (
            <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>
              {t("sidebar.learnSection")}
            </h2>
          )}
          <div className="space-y-1">
            <Button variant="ghost" className={buttonClass}>
              <PuzzlePiece className={iconClass} />
              {open && t("sidebar.puzzles")}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <GraduationCap className={iconClass} />
              {open && t("sidebar.lessons")}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <BookOpen className={iconClass} />
              {open && t("sidebar.openings")}
            </Button>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && (
            <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>
              {t("sidebar.communitySection")}
            </h2>
          )}
          <div className="space-y-1">
            <Button variant="ghost" className={buttonClass}>
              <Users className={iconClass} />
              {open && t("sidebar.players")}
            </Button>
            <Button variant="ghost" className={buttonClass}>
              <Activity className={iconClass} />
              {open && t("sidebar.activity")}
            </Button>
          </div>
        </div>
      </SidebarContent>

      <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

      <SidebarFooter className="p-4">
        <Button variant="ghost" className={buttonClass}>
          <Settings className={iconClass} />
          {open && t("sidebar.settings")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
