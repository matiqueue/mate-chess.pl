"use client"
import { useRouter } from "next/navigation"

export default function OnlineGameRoom({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Gra Online - Pokój: {params.id}</h1>
      {/* Tu możesz dodać czat lub inne elementy interfejsu gry */}
    </div>
  )
}
