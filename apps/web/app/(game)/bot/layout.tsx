import { MobileHeader } from "@/components/home/mobile-header"
import { Navbar } from "@/components/home/navbar"
import { Sidebar } from "@/components/home/sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

/**
 * Layout
 *
 * Komponent layoutu, który opakowuje zawartość aplikacji w SidebarProvider.
 * Wyświetla pełny układ strony zawierający sidebar, nagłówki oraz navbar.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane w głównej części layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący układ strony.
 *
 * @remarks
 * Autor: nasakrator
 */
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  // W przypadku, gdy URL jest dokładnie "/play/online", "/play/link" lub "/play/local",
  // lub zupełnie inny – wyświetlamy pełny layout (sidebar, nagłówki, navbar, itd.)
  return (
    <SidebarProvider>
      <div className="flex mon-h-screen w-full bg-sidebar">
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
