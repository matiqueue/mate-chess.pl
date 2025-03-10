"use client"

import { ThemeProvider } from "next-themes"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"

import "@workspace/ui/styles/globals.css"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"
import { AudioProvider } from "./home/audio-provider"
import { ErrorContextProvider } from "@/contexts/ErrorContextProvider"
import { ClerkProvider } from "@clerk/nextjs"

import { SidebarLayout } from "@/components/main/SidebarLayout" // dopasuj ścieżkę do lokalizacji pliku

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Jeśli ścieżka to "/", renderujemy tylko dzieci
  if (pathname === "/") {
    return <>{children}</>
  }

  // Jeśli ścieżka to "/home" lub "/play", renderujemy drzewo od ClerkProvider do ErrorContextProvider (bez sidebara)
  if (pathname === "/home" || pathname === "/play") {
    return (
      <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} enableColorScheme disableTransitionOnChange>
          <I18nextProvider i18n={i18n}>
            <Analytics />
            <AudioProvider>
              <ErrorContextProvider>{children}</ErrorContextProvider>
            </AudioProvider>
          </I18nextProvider>
        </ThemeProvider>
      </ClerkProvider>
    )
  }

  // Dla pozostałych ścieżek renderujemy pełny layout z SidebarLayout (czyli z SidebarProvider, Sidebar, MobileHeader, Navbar itd.)
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} enableColorScheme disableTransitionOnChange>
        <I18nextProvider i18n={i18n}>
          <Analytics />
          <AudioProvider>
            <ErrorContextProvider>
              <SidebarLayout>{children}</SidebarLayout>
            </ErrorContextProvider>
          </AudioProvider>
        </I18nextProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
