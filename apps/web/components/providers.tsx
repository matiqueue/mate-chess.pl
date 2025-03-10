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

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/") {
    return <>{children}</>
  }

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
