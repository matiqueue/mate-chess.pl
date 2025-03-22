import type { Metadata } from "next"
import PuzzlesClient from "./puzzles-client"

/**
 * Metadane strony puzzli szachowych.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export const metadata: Metadata = {
  title: "Chess Puzzles | Mate-Chess",
  description: "Test your chess knowledge with our interactive puzzles and quizzes",
}

/**
 * PuzzlesPage
 *
 * Komponent renderujący stronę puzzli szachowych. Zawartość strony jest dostarczana przez komponent PuzzlesClient.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę puzzli.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function PuzzlesPage(): JSX.Element {
  return (
    <>
      <PuzzlesClient />
    </>
  )
}
