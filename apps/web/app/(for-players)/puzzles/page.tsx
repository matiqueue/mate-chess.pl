import type { Metadata } from "next"
import PuzzlesClient from "./puzzles-client"

export const metadata: Metadata = {
  title: "Chess Puzzles | Mate-Chess",
  description: "Test your chess knowledge with our interactive puzzles and quizzes",
}

export default function PuzzlesPage() {
  return (
    <>
      <PuzzlesClient />
    </>
  )
}
