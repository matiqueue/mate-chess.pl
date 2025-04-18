"use client"

import * as React from "react"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { PuzzleIcon as Chess, Menu } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { ModeToggle } from "@workspace/ui/components/mode-toggle"
import { UserProfile } from "@/components/home/user-profile"
import { useTranslation } from "react-i18next"

/**
 * Navbar
 *
 * Komponent nawigacji, który renderuje górny pasek z logo, menu nawigacyjnym, przyciskiem "Quick Play", profilem użytkownika oraz przełącznikiem motywu.
 * W wersji mobilnej menu jest dostępne przez Sheet.
 *
 * @returns {JSX.Element} Element JSX reprezentujący pasek nawigacyjny.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 */
export function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const navItems = [
    { name: t("navbar.play"), href: "/play" },
    { name: t("navbar.learn"), href: "/lessons" },
    { name: t("navbar.puzzles"), href: "/puzzles" },
  ]

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2">
              <Chess className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">{t("navbar.brandName")}</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => {
                redirect("/play")
              }}
              variant="outline"
              className="hidden md:inline-flex"
            >
              <Chess className="mr-2 h-4 w-4" />
              {t("navbar.quickPlay")}
            </Button>
            <UserProfile />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/home" className="flex items-center space-x-2">
                  <Chess className="h-6 w-6" />
                  <span className="font-bold">{t("navbar.brandName")}</span>
                </Link>
                <nav className="mt-6 flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`transition-colors hover:text-foreground/80 ${pathname === item.href ? "text-foreground" : "text-foreground/60"}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
