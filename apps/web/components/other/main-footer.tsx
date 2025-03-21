"use client"

import Link from "next/link"
import { PuzzleIcon as Chess } from "lucide-react"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Chess className="h-5 w-5" />
            <span className="text-sm font-medium">Mate Chess</span>
          </div>
          <nav className="flex items-center space-x-4 text-sm">
            <Link
              href="/play"
              className="transition-colors hover:text-foreground/80"
            >
              {t("main-footer.play")}
            </Link>
            <Link
              href="/learn"
              className="transition-colors hover:text-foreground/80"
            >
              {t("main-footer.learn")}
            </Link>
            <Link
              href="/community"
              className="transition-colors hover:text-foreground/80"
            >
              {t("main-footer.community")}
            </Link>
            <a
              href="https://github.com/matiqueue/mate-chess.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground/80"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
