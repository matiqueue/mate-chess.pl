"use client"
import React, { useState, useEffect, useRef } from "react"
import {
  setupGame,
  startGame,
  getBoard,
  getPositionByCords,
  makeMove,
  getValidMovesForPosition,
  whosTurn, // Upewnij się, że ta metoda jest dostępna w silniku
} from "@workspace/chess-engine/functions"

import Board from "@modules/base/board/board"
import Position from "@modules/base/position"

// Import ikon z react-icons z pakietu FontAwesome
import { FaChessPawn, FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen, FaChessKing } from "react-icons/fa"
import { SiChessdotcom } from "react-icons/si"
const Page = () => {
  // Stan planszy, zaznaczonej pozycji oraz dostępnych ruchów
  const [board, setBoard] = useState<Board>()
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const gameInstanceRef = useRef<any>(null)

  // Inicjalizacja gry tylko raz
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

    // Jeśli nie mamy jeszcze wybranej pozycji, ustaw ją i pobierz dostępne ruchy
    if (!selectedPos) {
      setSelectedPos(clickedPos)
      // Zakładamy, że metoda getValidMovesForPosition przyjmuje board i wybraną pozycję
      const moves = getValidMovesForPosition(board, clickedPos)
      setValidMoves(moves)
    } else {
      // Jeśli klikamy kolejne pole, próbujemy wykonać ruch
      console.log("Trying to make move from " + selectedPos.notation + " to " + clickedPos.notation)
      makeMove(gameInstanceRef.current, { from: selectedPos, to: clickedPos })
      console.log("Turn: " + whosTurn(gameInstanceRef.current))
      // Aktualizujemy planszę po wykonanym ruchu
      const updatedBoard = getBoard(gameInstanceRef.current)
      setBoard(updatedBoard)
      // Czyscimy zaznaczenie i dostępne ruchy
      setSelectedPos(null)
      setValidMoves([])
    }
  }

  return (
    <>
      <div>
        <h1>Turn: {whosTurn(gameInstanceRef.current)}</h1>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="grid grid-cols-8 border border-gray-800">
          {Array.from({ length: 64 }).map((_, index) => {
            // Indeksowanie pól od 0 do 7:
            const x = index % 8
            const y = Math.floor(index / 8)
            const position: Position | null = board ? getPositionByCords(board, x, y) : null
            const figure = position?.figure || null

            // Sprawdzamy, czy to pole jest zaznaczone lub czy jest wśród dostępnych ruchów
            const isSelected = selectedPos && position && selectedPos.notation === position.notation
            const isValidMove = validMoves.some((move) => move.notation === position?.notation)

            // Ustalamy kolor tła: domyślny kolor zależny od szachownicy, ale jeżeli to dostępny ruch lub wybrana pozycja – zmieniamy kolor
            const defaultBg = (x + y) % 2 === 0 ? "bg-gray-300" : "bg-gray-600"
            const bgColor = isSelected ? "bg-blue-300" : isValidMove ? "bg-green-300" : defaultBg

            return (
              <div
                key={index}
                className={`w-16 h-16 flex items-center justify-center border text-lg font-bold ${bgColor} ${isSelected ? "border-blue-500" : ""}`}
                onClick={() => handleClick(x, y)}
              >
                {figure ? getFigureIcon(figure.type, figure.color) : null}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Funkcja pomocnicza do wyświetlania ikony figury za pomocą react-icons
const getFigureIcon = (type?: string, color?: string) => {
  if (!type) return null

  // Ustalamy wspólne propsy dla ikon; możesz je dowolnie modyfikować
  const commonProps = {
    size: 24,
    color: color === "black" ? "black" : "white",
  }

  switch (type) {
    case "pawn":
      return <SiChessdotcom {...commonProps} />
    case "knight":
      return <FaChessKnight {...commonProps} />
    case "bishop":
      return <FaChessBishop {...commonProps} />
    case "rook":
      return <FaChessRook {...commonProps} />
    case "queen":
      return <FaChessQueen {...commonProps} />
    case "king":
      return <FaChessKing {...commonProps} />
    default:
      return null
  }
}

export default Page
