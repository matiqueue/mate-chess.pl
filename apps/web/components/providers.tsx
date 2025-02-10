"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname()

  if (pathname === "/") {
    return <>{children}</>
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      enableColorScheme
      disableTransitionOnChange
    >
      <Analytics/>
      {children}
    </ThemeProvider>
  )
}
