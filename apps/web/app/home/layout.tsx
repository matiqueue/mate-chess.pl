import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
