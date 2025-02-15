"use client"

import React, { useState, useEffect, useRef } from "react"
import { setupGame, getBoard, getPositionByCords, makeMove, getValidMoves, whosTurn, isCheckmate } from "@workspace/chess-engine/functions"
import { Board, Position } from "@modules/utils/boardUtils"
import { King } from "@modules/utils/figureUtils"
import { FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen, FaChessKing } from "react-icons/fa"
import { SiChessdotcom as ChessPawn } from "react-icons/si"
import clsx from "clsx"

export default function Chessboard() {
  const [board, setBoard] = useState<Board | null>(null)
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const gameInstanceRef = useRef(setupGame())
  const [turn, setTurn] = useState<"white" | "black">(whosTurn(gameInstanceRef.current))
  const [checkmate, setCheckmate] = useState<"white" | "black" | null>(null)

  useEffect(() => {
    if (!gameInstanceRef.current) return
    setBoard(getBoard(gameInstanceRef.current))
  }, [])

  const handleClick = (x: number, y: number) => {
    if (!gameInstanceRef.current || !board) return
    const clickedPos = getPositionByCords(board, x, y)
    if (!clickedPos) return

    if (clickedPos.figure && clickedPos.figure.color === turn) {
      setSelectedPos(clickedPos)
      setValidMoves(getValidMoves(board, clickedPos))
      return
    }

    if (!selectedPos) {
      setSelectedPos(clickedPos)
      setValidMoves(getValidMoves(board, clickedPos))
      return
    }

    makeMove(gameInstanceRef.current, { from: selectedPos, to: clickedPos })

    // Update game state
    const updatedBoard = getBoard(gameInstanceRef.current)
    setBoard(updatedBoard)
    setTurn(whosTurn(gameInstanceRef.current))
    setSelectedPos(null)
    setValidMoves([])
    setCheckmate(isCheckmate(gameInstanceRef.current))
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Turn: {turn.toUpperCase()}</h1>
      {checkmate && <h1 className="text-4xl text-red-600 mt-4">Checkmate! {checkmate.charAt(0).toUpperCase() + checkmate.slice(1)} wins!</h1>}

      <div className="grid grid-cols-8 border border-gray-800">
        {Array.from({ length: 64 }).map((_, index) => {
          const x = index % 8
          const y = Math.floor(index / 8)
          const position = board ? getPositionByCords(board, x, y) : null
          const figure = position?.figure || null
          const isSelected = selectedPos && position && selectedPos.notation === position.notation
          const isValidMove = validMoves.some((move) => move.notation === position?.notation)
          const isOpponentMove = selectedPos?.figure?.color !== turn
          const isKingInCheck = figure?.type === "king" && (figure as King).isCheck

          const defaultBg = (x + y) % 2 === 0 ? "bg-gray-300" : "bg-gray-600"
          const bgColor = isKingInCheck
            ? "bg-red-500"
            : isSelected
              ? "bg-blue-300"
              : isValidMove
                ? isOpponentMove
                  ? "bg-gray-500"
                  : "bg-green-300"
                : defaultBg

          return (
            <div
              key={index}
              className={clsx("w-12 h-12 flex items-center justify-center border text-lg font-bold", bgColor, isSelected && "border-blue-500")}
              onClick={() => handleClick(x, y)}
            >
              {figure ? getFigureIcon(figure.type, figure.color) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper function for displaying chess piece icons
const getFigureIcon = (type?: string, color?: string) => {
  if (!type) return null

  const commonProps = {
    size: 28,
    color: color === "black" ? "black" : "white",
    className: "drop-shadow-md",
  }

  switch (type) {
    case "pawn":
      return <ChessPawn {...commonProps} />
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
