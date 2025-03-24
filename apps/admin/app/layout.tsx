import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@workspace/ui/styles/globals.css"
import { ErrorContextProvider } from "@/context/ErrorContextProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panel Administracyjny",
  description: "Panel administracyjny z logowaniem",
}

/**
 * RootLayout
 *
 * Główny komponent layoutu aplikacji.
 * Ustawia język oraz motyw strony, a także opakowuje aplikację w ErrorContextProvider,
 * aby umożliwić globalne raportowanie błędów.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane w ramach layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący główny layout aplikacji.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="dark">
      <body className={inter.className}>
        <ErrorContextProvider>{children}</ErrorContextProvider>
      </body>
    </html>
  )
}
