import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

/**
 * HomeLayout
 *
 * Komponent layoutu strony głównej, który opakowuje zawartość aplikacji w kontekst SidebarProvider.
 * Wyświetla pasek boczny, nagłówek mobilny oraz navbar dla desktopu, a także renderuje główną zawartość strony.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne, które zostaną wyrenderowane w głównej części layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący layout strony głównej.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function HomeLayout({ children }: { children: React.ReactNode }): JSX.Element {
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
