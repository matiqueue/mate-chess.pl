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
import ChessEngine from "@modules/base/chessEngine"
import chessGame from "@modules/chessGame"
const Page = () => {
  // Stan planszy, zaznaczonej pozycji oraz dostępnych ruchów
  const [board, setBoard] = useState<Board>()
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const gameInstanceRef = useRef<chessGame>(setupGame())
  const [turn, setTurn] = useState<"white" | "black">(whosTurn(gameInstanceRef.current))

  // Inicjalizacja gry tylko raz
  useEffect(() => {
    if (!gameInstanceRef.current) {
      return
    }
    startGame(gameInstanceRef.current)
    const initialBoard = getBoard(gameInstanceRef.current)
    setBoard(initialBoard)
  }, [])

  // Obsługa kliknięć na polach planszy
  const handleClick = (x: number, y: number) => {
    if (!gameInstanceRef.current || !board) return

    const clickedPos = getPositionByCords(board, x, y)
    if (!clickedPos) return

    const clickedFigure = clickedPos.figure

    if (clickedFigure && clickedFigure.color !== turn) {
      setSelectedPos(clickedPos)
      setValidMoves(getValidMovesForPosition(board, clickedPos))
      return
    }
    // Jeśli nie mamy jeszcze wybranej pozycji, ustaw ją i pobierz dostępne ruchy
    if (!selectedPos) {
      setSelectedPos(clickedPos)
      setValidMoves(getValidMovesForPosition(board, clickedPos))
      return
    }
    // Jeśli klikamy kolejne pole, próbujemy wykonać ruch
    makeMove(gameInstanceRef.current, { from: selectedPos, to: clickedPos })

    // Aktualizujemy planszę po wykonanym ruchu
    const updatedBoard = getBoard(gameInstanceRef.current)
    setBoard(updatedBoard)

    // Czyscimy zaznaczenie i dostępne ruchy
    setBoard(getBoard(gameInstanceRef.current))
    setTurn(whosTurn(gameInstanceRef.current))
    setSelectedPos(null)
    setValidMoves([])
  }

  return (
    <>
      <div>
        <h1>Turn: {gameInstanceRef ? whosTurn(gameInstanceRef.current) : "An error occured"}</h1>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="grid grid-cols-8 border border-gray-800">
          {Array.from({ length: 64 }).map((_, index) => {
            const x = index % 8
            const y = Math.floor(index / 8)
            const position: Position | null = board ? getPositionByCords(board, x, y) : null
            const figure = position?.figure || null

            const isSelected = selectedPos && position && selectedPos.notation === position.notation
            const isValidMove = validMoves.some((move) => move.notation === position?.notation)

            // podświetli nam na szaro gdy valid moves jest dla drugiego gracza
            const isOpponentMove = selectedPos?.figure?.color !== turn

            const defaultBg = (x + y) % 2 === 0 ? "bg-gray-300" : "bg-gray-600"
            const bgColor = isSelected ? "bg-blue-300" : isValidMove ? (isOpponentMove ? "bg-gray-500" : "bg-green-300") : defaultBg

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
