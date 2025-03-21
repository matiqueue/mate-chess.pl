import ChessLessons from "@/components/lessons/lessons"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chess Lessons | Mate-Chess",
  description: "Learn basics and advance tactics in the Mate Chess World!",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ChessLessons />
    </main>
  )
}