"use client"

import { usePathname } from "next/navigation"
import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {

  // W przypadku, gdy URL jest dokładnie "/play/online", "/play/link" lub "/play/local",
  // lub zupełnie inny – wyświetlamy pełny layout (sidebar, nagłówki, navbar, itd.)
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