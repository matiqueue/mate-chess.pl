import ChessOpenings from "@/components/openings/openings"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chess Openigns | Mate-Chess",
  description: "Learn various openings from best players in history!",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ChessOpenings></ChessOpenings>
    </main>
  )
}