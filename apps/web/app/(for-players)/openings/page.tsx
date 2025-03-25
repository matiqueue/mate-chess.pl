import ChessOpenings from "@/components/openings/openings"
import type { Metadata } from "next"

/**
 * Metadane strony Chess Openings.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export const metadata: Metadata = {
  title: "Chess Openigns | Mate-Chess",
  description: "Learn various openings from best players in history!",
}

/**
 * Home
 *
 * Komponent główny strony, który renderuje sekcję otwarć szachowych.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę otwarć szachowych.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ChessOpenings />
    </main>
  )
}
