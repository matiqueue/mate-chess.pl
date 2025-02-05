"use client"
import React, { useState, useEffect, useRef } from "react"
import { setupGame, startGame, getBoard, getPositionByCords, makeMove } from "@workspace/chess-engine/functions"

import Board from "@modules/base/board/board"
import Position from "@modules/base/position"

const Page = () => {
  // Stan planszy zaktualizowany po każdym ruchu
  const [board, setBoard] = useState<Board>()
  // Stan do przechowywania pierwszego kliknięcia (wybranej pozycji)
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const gameInstanceRef = useRef<any>(null)

  // Inicjalizujemy grę tylko raz
  useEffect(() => {
    if (!gameInstanceRef.current) {
      gameInstanceRef.current = setupGame()
      startGame(gameInstanceRef.current)
      const initialBoard = getBoard(gameInstanceRef.current)
      setBoard(initialBoard)
    }
  }, [])

  // Obsługa kliknięć na polach planszy
  const handleClick = (x: number, y: number) => {
    if (!board) return

    const clickedPos = getPositionByCords(board, x, y)
    if (!clickedPos) return

    // Jeśli nie wybraliśmy jeszcze pierwszej pozycji, ustaw ją
    if (!selectedPos) {
      setSelectedPos(clickedPos)
    } else {
      // Mamy już pierwszą pozycję, więc próbujemy wykonać ruch
      console.log("Trying to make move from " + selectedPos.notation + " to " + clickedPos.notation)
      makeMove(board, { from: selectedPos, to: clickedPos })
      // Po wykonaniu ruchu pobieramy zaktualizowaną planszę
      const updatedBoard = getBoard(gameInstanceRef.current)
      setBoard(updatedBoard)
      setSelectedPos(null)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-8 border border-gray-800">
        {Array.from({ length: 64 }).map((_, index) => {
          // Indeksujemy pola od 0 do 7:
          const x = index % 8
          const y = Math.floor(index / 8)
          const position: Position | null = board ? getPositionByCords(board, x, y) : null
          const figure = position?.figure || null
          const isSelected = selectedPos && position && selectedPos.notation === position.notation

          return (
            <div
              key={index}
              className={`w-16 h-16 flex items-center justify-center border text-lg font-bold ${
                (x + y) % 2 === 0 ? "bg-gray-300" : "bg-gray-600"
              } ${isSelected ? "border-blue-500" : ""}`}
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

// Funkcja pomocnicza do wyświetlania symbolu figury
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
