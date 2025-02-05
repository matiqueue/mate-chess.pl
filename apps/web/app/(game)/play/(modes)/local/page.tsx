"use client"
import React, { useState, useEffect, useRef } from "react"
import { setupGame, startGame, getBoard, getPositionByCords } from "@workspace/chess-engine/functions"

import Board from "@modules/base/board/board"
import Position from "@modules/base/position"

const Page = () => {
  const [board, setBoard] = useState<Board>()
  const gameInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Ogarniamy, żeby ta logika wykonala się tylko raz
    if (!gameInstanceRef.current) {
      gameInstanceRef.current = setupGame()
      startGame(gameInstanceRef.current)
      const initialBoard = getBoard(gameInstanceRef.current)
      setBoard(initialBoard)
    }
  }, [])

  const handleClick = (x: number, y: number) => {
    if (!board) return
    const position = getPositionByCords(board, x, y)
    if (position) {
      console.log(`Kliknięto na pole: ${position.notation}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-8 border border-gray-800">
        {Array.from({ length: 64 }).map((_, index) => {
          const x = index % 8
          const y = Math.floor(index / 8)
          const position: Position | null = board ? getPositionByCords(board, x, y) : null
          const figure = position?.figure || null

          return (
            <div
              key={index}
              className={`w-16 h-16 flex items-center justify-center border text-lg font-bold ${(x + y) % 2 === 0 ? "bg-gray-300" : "bg-gray-600"}`}
              onClick={() => handleClick(x, y)}
            >
              {figure ? getFigureSymbol(figure.type, figure.color) : ""}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Funkcja do wyświetlania litery figurki
const getFigureSymbol = (type?: string, color?: string) => {
  if (!type) return ""

  const symbols: Record<string, string> = {
    pawn: "P",
    knight: "N",
    bishop: "B",
    rook: "R",
    queen: "Q",
    king: "K",
  }

  const letter = symbols[type] || "?"
  return color === "black" ? letter.toLowerCase() : letter.toUpperCase()
}

export default Page
