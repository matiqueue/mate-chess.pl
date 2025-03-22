import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { Metadata } from "next"

/**
 * Metadane strony.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko) i matiqueue
 */
export const metadata: Metadata = {
  title: "Statistics | Play Chess Online",
  description: "Get to know your statistics!",
}

/**
 * Layout
 *
 * Opakowuje zawartość strony w SidebarProvider oraz ustawia układ strony.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane w głównej części layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący layout.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko) i matiqueue
 */
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <div className="flex-1 flex flex-col">
          <main className="flex flex-col flex-grow justify-center">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
