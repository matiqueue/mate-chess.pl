import ClientLayout from "@/components/game/client-layout"

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
  return <ClientLayout>{children}</ClientLayout>
}
