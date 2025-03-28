"use client"
import { Navbar } from "@/components/other/main-navbar"
import { Footer } from "@/components/other/main-footer"
/**
 * minimalLayout
 *
 * Układ zawiera NavBar, Footer oraz główną zawartość strony.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {React.ReactNode} props.children - Elementy potomne, które zostaną wyrenderowane w głównej części layoutu.
 * @returns {JSX.Element} Element JSX reprezentujący pełny layout strony.
 *
 * @remarks
 * Autor: Jakub Batko
 */
export function MinimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center space-x-4">
        {children}
      </div>

      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  )
}