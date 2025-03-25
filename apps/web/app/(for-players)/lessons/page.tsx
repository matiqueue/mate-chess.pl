import ChessLessons from "@/components/lessons/lessons"
import type { Metadata } from "next"

/**
 * Metadane strony Chess Lessons.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko)
 */
export const metadata: Metadata = {
  title: "Chess Lessons | Mate-Chess",
  description: "Learn basics and advance tactics in the Mate Chess World!",
}

/**
 * Home
 *
 * Komponent główny strony lekcji szachowych. Renderuje sekcję z lekcjami szachowymi.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę lekcji szachowych.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko)
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ChessLessons />
    </main>
  )
}
