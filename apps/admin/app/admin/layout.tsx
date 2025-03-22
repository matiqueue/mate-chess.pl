"use client"

import { useEffect } from "react" // Import hooka useEffect
import { useRouter } from "next/navigation" // Import hooka useRouter

/**
 * Komponent AdminLayout
 *
 * Renderuje layout dla strony administracyjnej. Jeśli użytkownik nie jest zalogowany,
 * następuje przekierowanie do strony logowania.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane wewnątrz layoutu.
 * @returns {JSX.Element} Element JSX zawierający przekazane dzieci.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 *
 * @note ta funkcja jest zrobiona z AI
 */
export default function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
}
