import ChessTournaments from "@/components/tournaments/chessTournaments"

export default function TournamentsPage() {
  return (
    <div className="flex flex-col h-screen">
        <div className="grid h-screen w-full">
            <ChessTournaments></ChessTournaments>
        </div>
    </div>
  )
}