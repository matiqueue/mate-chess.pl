"use client"

import { Button } from "@workspace/ui/components/button"
import { Users, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Activity, Settings, Home, Bot, GraduationCap, X } from "lucide-react"
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
import { redirect } from "next/navigation"
import { useSidebarContext } from "@/contexts/SidebarContext"

export function LeftSidebar() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { open, setOpen } = useSidebar()
  const { user } = useUser()
  const clerk = useClerk()
  const { mode, consoleLogs } = useSidebarContext()

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarOpen")
    if (storedState !== null) {
      const value = storedState === "true"
      if (open !== value) {
        setOpen(value)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarOpen", open.toString())
  }, [open])

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900"
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600"
  const borderColor = isDark ? "border-white/10" : "border-zinc-200"

  const buttonClass = open
    ? `w-full flex items-center justify-start px-2 ${textColor} hover:bg-white/10`
    : `w-full flex items-center justify-center ${textColor} hover:bg-white/10`
  const iconClass = open ? "mr-2 h-4 w-4" : "h-4 w-4"
  const headerClass = open
    ? `text-2xl font-bold flex items-center pt-4 pl-4 gap-4 ${textColor}`
    : `text-2xl font-bold flex items-center justify-center ${textColor}`
  const titleIconClass = "h-6 w-6 flex-none"

  function DefaultHeader() {
    return (
      <SidebarHeader className="p-2 text-center">
        <h1 className={headerClass}>
          <PuzzlePiece className={titleIconClass} />
          {open && t("sidebar.brandName")}
        </h1>
      </SidebarHeader>
    )
  }

  function ConsoleHeader() {
    return (
      <SidebarHeader className="p-2 text-center">
        <h1 className={`${headerClass} font-mono`}>{open && "Konsola"}</h1>
      </SidebarHeader>
    )
  }

  function DefaultContent() {
    return (
      <>
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
            <Button
              onClick={() => {
                redirect("/puzzles")
              }}
              variant="ghost"
              className={buttonClass}
            >
              <PuzzlePiece className={iconClass} />
              {open && t("sidebar.puzzles")}
            </Button>
            <Button
              onClick={() => {
                redirect("/lessons")
              }}
              variant="ghost"
              className={buttonClass}
            >
              <GraduationCap className={iconClass} />
              {open && t("sidebar.lessons")}
            </Button>
            <Button
              onClick={() => {
                redirect("/openings")
              }}
              variant="ghost"
              className={buttonClass}
            >
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
      </>
    )
  }

  function ConsoleContent() {
    return (
      <div className="flex-1 px-1 pb-4 font-mono">
        <div className={`${theme === "dark" ? "bg-black/60" : "bg-white/60"} rounded-md p-4 h-[calc(100vh-200px)] overflow-y-auto ${textColor}`}>
          {consoleLogs.length === 0 ? (
            <p className={`text-sm ${mutedTextColor}`}>[Brak logów]</p>
          ) : (
            consoleLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className={`text-xs ${mutedTextColor}`}></span>
                <p className={`text-sm break-all ${textColor}`}>{log}</p>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <Sidebar
      collapsible="icon"
      style={{ width: open ? "16rem" : "4rem" }}
      className={`flex flex-col border-r ${borderColor} bg-background/30 backdrop-blur-sm rounded-tr-2xl rounded-br-2xl`}
    >
      {open && (mode === "default" ? <DefaultHeader /> : <ConsoleHeader />)}
      <SidebarContent className="flex-1 p-4 space-y-4">{mode === "default" ? <DefaultContent /> : <ConsoleContent />}</SidebarContent>
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
            <Button variant="ghost" className="absolute top-2 right-2" asChild>
              <AlertDialogCancel>
                <X className="h-5 w-5 hover:text-foreground" />
              </AlertDialogCancel>
            </Button>
            <AlertDialogTitle className="text-xl font-semibold text-center mt-2 w-full">{t("settings")}</AlertDialogTitle>
            <div className="flex items-center justify-between w-full mt-2 px-2">
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
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
