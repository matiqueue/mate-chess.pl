"use client"

import { usePathname } from "next/navigation"
import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Jeśli ścieżka zaczyna się od /play/online lub /play/link, nie pokazujemy Navbar
  const hideNavbar = pathname.startsWith("/play/online") || pathname.startsWith("/play/link") || pathname.startsWith("/play/local")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader className="md:hidden" />
          {!hideNavbar && <Navbar className="hidden md:flex" />}
          <main className="flex flex-col flex-grow items-center justify-center">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
