import ChessTournaments from "@/components/tournaments/chessTournaments"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chess Tournaments | Mate-Chess",
  description: "Take part in professional chess tournaments!",
}

export default function TournamentsPage() {
  return (
    <div className="flex flex-col h-screen">
        <div className="grid h-screen w-full">
            <ChessTournaments></ChessTournaments>
        </div>
    </div>
  )
}