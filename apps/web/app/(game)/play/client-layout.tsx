"use client"

import { usePathname } from "next/navigation"
import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

/**
 * Layout
 *
 * Komponent layoutu, który warunkowo renderuje pełny układ strony zawierający Sidebar, MobileHeader, Navbar oraz główną zawartość.
 * Jeśli ścieżka URL zaczyna się od "/play/online" lub "/play/link", albo jest dokładnie "/play/local",
 * zwracana jest jedynie zawartość, bez dodatkowego layoutu.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane w ramach layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący układ strony.
 *
 * @remarks
 * Autor: nasakrator
 */
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname()

  // Jeśli ścieżka URL dotyczy trybów gry, zwracamy tylko zawartość.
  if (pathname.startsWith("/play/online") || pathname.startsWith("/play/link") || pathname === "/play/local") {
    return <>{children}</>
  }

  // Dla pozostałych ścieżek renderujemy pełny layout.
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader className="md:hidden" />
          <Navbar className="hidden md:flex" />
          <main className="flex flex-col flex-grow justify-center">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
