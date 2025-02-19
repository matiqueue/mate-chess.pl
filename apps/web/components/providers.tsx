"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"
import { AudioProvider } from "@/components/home/audio-provider"
import "@workspace/ui/styles/globals.css"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n"

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname()

  if (pathname === "/") {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} enableColorScheme disableTransitionOnChange>
      <I18nextProvider i18n={i18n}>
        {children}
        <Analytics />
        <AudioProvider>{children}</AudioProvider>
      </I18nextProvider>
      ;
    </ThemeProvider>
  )
}
