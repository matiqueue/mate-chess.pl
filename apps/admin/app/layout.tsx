import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ErrorContextProvider } from "@/context/ErrorContextProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panel Administracyjny",
  description: "Panel administracyjny z logowaniem",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="dark">
      <body className={inter.className}>
        <ErrorContextProvider>{children}</ErrorContextProvider>
      </body>
    </html>
  )
}
