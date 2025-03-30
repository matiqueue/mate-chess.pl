import ChessTournaments from "@/components/tournaments/chessTournaments"
import type { Metadata } from "next"

/**
 * Metadane strony turniejów szachowych.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko)
 */
export const metadata: Metadata = {
  title: "Chess Tournaments | Mate-Chess",
  description: "Take part in professional chess tournaments!",
}

/**
 * TournamentsPage
 *
 * Komponent renderujący stronę turniejów szachowych.
 * Strona opakowuje zawartość w pełnoekranowy układ.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę turniejów szachowych.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko)
 */
export default function TournamentsPage() {
  return (
    <div className="flex flex-col">
      <div className="grid w-full">
        <ChessTournaments />
      </div>
    </div>
  )
}
