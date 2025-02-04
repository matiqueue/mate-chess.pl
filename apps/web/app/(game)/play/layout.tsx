import { MobileHeader } from "@/components/mobile-header"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader className="md:hidden" />
          <Navbar className="hidden md:flex" />
          <main className="flex flex-col flex-grow items-center justify-center">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
