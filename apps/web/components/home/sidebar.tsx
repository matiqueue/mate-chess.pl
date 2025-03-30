"use client"

import { useUser } from "@clerk/nextjs"
import { redirect, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, PlayCircle, PuzzleIcon as PuzzlePiece, Bot, GraduationCap, Trophy, Users, BookOpen, Activity, Settings } from "lucide-react"

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

import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { use, useEffect, useState } from "react"

/**
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 */

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

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const clerk = useClerk()
  const { t } = useTranslation()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Jeśli jesteśmy na określonych ścieżkach, nie renderujemy sidebaru
  if (pathname.startsWith("/play/online") || pathname.startsWith("/play/link") || pathname === "/play/local") {
    return null
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/clearCookie", {
        method: "POST",
      })
    } catch (error) {
      console.error("Błąd przy czyszczeniu ciasteczka:", error)
    }
    router.push("/")
  }

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-6">
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-2">
            <PuzzlePiece className="h-6 w-6" />
            <h1 className="text-xl font-bold">{t("brandName")}</h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <div>
              <NavItem href="/home" icon={Home}>
                {t("home")}
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">{t("navPlay")}</h2>
              </div>
              <NavItem href="/play" icon={PlayCircle} badge={t("live")}>
                {t("playOnline")}
              </NavItem>
              <NavItem href="/bot" icon={Bot}>
                {t("playVsBot")}
              </NavItem>
              <NavItem href="/tournaments" icon={Trophy}>
                {t("tournaments")}
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">{t("navLearn")}</h2>
              </div>
              <NavItem href="/puzzles" icon={PuzzlePiece} badge={t("daily")}>
                {t("puzzles")}
              </NavItem>
              <NavItem href="/lessons" icon={GraduationCap}>
                {t("lessons")}
              </NavItem>
              <NavItem href="/openings" icon={BookOpen}>
                {t("openings")}
              </NavItem>
            </div>

            <Separator className="mx-6" />

            <div>
              <NavItem href="/settings" icon={Settings}>
                {t("settings")}
              </NavItem>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton>
              <Button variant="outline">{t("login")}</Button>
            </SignInButton>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">{t("offline")}</span>
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

                <DropdownMenuItem
                  onClick={() => {
                    redirect("profile")
                  }}
                >
                  <Link href="#">{t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    redirect("profile/stats/" + user?.id)
                  }}
                >
                  <Link href="#">{t("yourStatistics")}</Link>
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
        </SignedIn>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
