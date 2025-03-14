"use client"

import { usePathname } from "next/navigation"
import { MobileHeader } from "@/components/home/mobile-header"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Jeśli ścieżka zaczyna się od bazowych i ma dodatkowy segment (np. "/play/link/costma")
  if (pathname.startsWith("/play/online") || pathname.startsWith("/play/link") || pathname === "/play/local") {
    return <>{children}</>
  }

  // W przypadku, gdy URL jest dokładnie "/play/online", "/play/link" lub "/play/local",
  // lub zupełnie inny – wyświetlamy pełny layout (sidebar, nagłówki, navbar, itd.)
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader className="md:hidden" />
          <main className="flex justify-center">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
