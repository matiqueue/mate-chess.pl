"use client"

import { ClerkProvider, useUser } from "@clerk/nextjs"

/**
 * Layout
 *
 * Opakowuje aplikację w ClerkProvider i ustawia tytuł strony na podstawie danych użytkownika.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane wewnątrz Layout.
 * @returns {JSX.Element} Element JSX reprezentujący Layout.
 *
 * @remarks
 * Autor: nasakrator (Jakub Batko)
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  if (user) {
    document.title = ` ${user.firstName || user.fullName || "User"}'s Profile`
  }

  return <ClerkProvider>{children}</ClerkProvider>
}
