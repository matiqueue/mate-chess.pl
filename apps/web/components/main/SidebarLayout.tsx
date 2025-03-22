"use client"

import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"

/**
 * SidebarLayout
 *
 * Komponent layoutu, który opakowuje aplikację w kontekst SidebarProvider oraz renderuje pełny układ strony.
 * Układ zawiera sidebar, nagłówki (MobileHeader, Navbar) oraz główną zawartość strony.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne, które zostaną wyrenderowane w głównej części layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący pełny layout strony.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export function SidebarLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader className="md:hidden" />
          <Navbar className="hidden md:flex" />
          <main className="flex-1 overflow-y-auto">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
