"use client"

import { Button } from "@workspace/ui/components/button"
import { Users, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Activity, Settings, PuzzleIcon, Home, Bot, GraduationCap, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from "@workspace/ui/components/sidebar"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { LanguageSwitcher } from "../home/language-switcher"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"

export function LeftSidebar() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { open, setOpen } = useSidebar()
  const { user } = useUser()
  const clerk = useClerk()

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
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>{t("sidebar.playSection")}</h2>}
          <div className="space-y-1">
            <Link href="/play">
              <Button variant="ghost" className={buttonClass}>
                <Users className={iconClass} />
                {open && t("sidebar.playOnline")}
              </Button>
            </Link>
            <Link href="/bot">
              <Button variant="ghost" className={buttonClass}>
                <Bot className={iconClass} />
                {open && t("sidebar.playVsBot")}
              </Button>
            </Link>
            <Link href="/tournaments">
              <Button variant="ghost" className={buttonClass}>
                <Trophy className={iconClass} />
                {open && t("sidebar.tournaments")}
              </Button>
            </Link>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>{t("sidebar.learnSection")}</h2>}
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
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>{t("sidebar.communitySection")}</h2>}
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={buttonClass}>
              <Settings className={iconClass} />
              {open && t("sidebar.settings")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="flex flex-col items-center justify-center bg-sidebar/30 backdrop-blur p-10 rounded-md">
            {/* "X" w prawym górnym rogu */}
            <Button variant="ghost" className="absolute top-2 right-2" asChild>
              <AlertDialogCancel>
                <X className="h-5 w-5 hover:text-foreground" />
              </AlertDialogCancel>
            </Button>
            {/* "Settings" na środku */}
            <AlertDialogTitle className="text-xl font-semibold text-center mt-2 w-full">{t("settings")}</AlertDialogTitle>
            <AlertDialogDescription className="flex items-center justify-between w-full mt-2 px-2">
              <SignedOut>
                <SignInButton>
                  <Button variant="outline">{t("login")}</Button>
                </SignInButton>

                <span className="inline-flex items-center">
                  <LanguageSwitcher />
                </span>
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
                        <Link href="/profile">{t("profile")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={"profile/stats/" + user?.id}>{t("yourStatistics")}</Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => clerk.signOut()}>{t("logout")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t("online")}</span>
                  </div>
                </div>

                <span className="inline-flex items-center">
                  <LanguageSwitcher />
                </span>
              </SignedIn>
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
