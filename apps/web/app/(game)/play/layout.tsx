import { Metadata } from "next"
import ClientLayout from "@/components/game/client-layout"

/**
 * Metadane strony.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export const metadata: Metadata = {
  title: "Play Chess Online | Mate-Chess",
  description: "Play chess in various modes: online, local, or via link!",
}

/**
 * Layout
 *
 * Opakowuje zawartość aplikacji w ClientLayout, który stanowi główny layout strony.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne renderowane wewnątrz layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący layout aplikacji.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return <ClientLayout>{children}</ClientLayout>
}
