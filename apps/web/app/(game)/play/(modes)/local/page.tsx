"use client"
import React, { useState, useEffect } from "react"
import { setupGame } from "@workspace/chess-engine/functions"
import ChessGame from "@modules/chessGame"

const Page = () => {
  const [game, setGame] = useState<ChessGame | null>(null) // ✅ Ustawienie poprawnego typu

  useEffect(() => {
    const newGame = setupGame()
    setGame(newGame)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-8 border border-gray-800">
        {Array.from({ length: 64 }).map((_, index) => {
          const x = index % 8
          const y = Math.floor(index / 8)
          return <div key={index} className={`w-16 h-16 flex items-center justify-center border ${(x + y) % 2 === 0 ? "bg-gray-300" : "bg-gray-600"}`}></div>
        })}
      </div>
    </div>
  )
}

export default Page
