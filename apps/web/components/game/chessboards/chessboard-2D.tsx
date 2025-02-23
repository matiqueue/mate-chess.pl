/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  FaChessRook as ChessRook,
  FaChessKnight as ChessKnight,
  FaChessBishop as ChessBishop,
  FaChessQueen as ChessQueen,
  FaChessKing as ChessKing,
} from "react-icons/fa"
import { SiChessdotcom as ChessPawn } from "react-icons/si"
import { useTheme } from "next-themes"
import clsx from "clsx"
import { useGameContext } from "@/contexts/GameContext"

interface Position {
  notation: string
  figure: { type: string; color: string } | null
}

interface Arrow {
  start: { x: number; y: number }
  end: { x: number; y: number }
}

export function ChessBoard2D() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const { board, movePiece, getValidMoves, currentPlayer } = useGameContext()
  const boardRef = useRef<HTMLDivElement>(null)

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [isDrawingArrow, setIsDrawingArrow] = useState(false)
  const [currentArrow, setCurrentArrow] = useState<Arrow | null>(null)
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [lastMove, setLastMove] = useState<string | null>(null)

  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ]

  const rawBoard = board ? board.getBoardArray() : initialBoard
  const boardRows = rawBoard.slice(rawBoard.length - 8)

  const getNotation = (rowIndex: number, colIndex: number) => {
    const letters = "abcdefgh"
    const rank = 8 - rowIndex
    const file = letters.charAt(colIndex)
    return file + rank
  }

  const getSquareCenter = (rowIndex: number, colIndex: number) => {
    if (!boardRef.current) return { x: 0, y: 0 }
    const squareSize = boardRef.current.offsetWidth / 8
    const x = colIndex * squareSize + squareSize / 2
    const y = rowIndex * squareSize + squareSize / 2
    return { x, y }
  }

  const getClosestSquareCenter = (x: number, y: number) => {
    if (!boardRef.current) return { x: 0, y: 0 }
    const squareSize = boardRef.current.offsetWidth / 8
    const colIndex = Math.min(Math.max(Math.round(x / squareSize), 0), 7)
    const rowIndex = Math.min(Math.max(Math.round(y / squareSize), 0), 7)
    return getSquareCenter(rowIndex, colIndex)
  }

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    if (!board) return
    const notation = getNotation(rowIndex, colIndex)
    const square = board.getPositionByNotation(notation)
    if (!square) return

    if (!selectedSquare) {
      if (square.figure && square.figure.color === currentPlayer) {
        setSelectedSquare(square)
        setValidMoves(getValidMoves(square))
      }
      return
    }

    if (selectedSquare.notation === square.notation) {
      setSelectedSquare(null)
      setValidMoves([])
      return
    }

    const isValid = validMoves.some((pos) => pos.notation === square.notation)
    if (isValid) {
      movePiece(selectedSquare, square)
      setLastMove(`${selectedSquare.notation}-${square.notation}`)
      setSelectedSquare(null)
      setValidMoves([])
    } else {
      if (square.figure && square.figure.color === currentPlayer) {
        setSelectedSquare(square)
        setValidMoves(getValidMoves(square))
      } else {
        setSelectedSquare(null)
        setValidMoves([])
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
    if (e.button === 2) {
      // Prawy przycisk myszy
      e.preventDefault()
      const startPos = getSquareCenter(rowIndex, colIndex)
      setIsDrawingArrow(true)
      setCurrentArrow({ start: startPos, end: startPos })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawingArrow && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCurrentArrow((prev) => (prev ? { ...prev, end: { x, y } } : null))
    }
  }

  const handleMouseUp = () => {
    if (isDrawingArrow && currentArrow && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect()
      const endX = currentArrow.end.x
      const endY = currentArrow.end.y
      const adjustedEnd = getClosestSquareCenter(endX, endY)
      const finalArrow = { start: currentArrow.start, end: adjustedEnd }
      setArrows((prev) => [...prev, finalArrow])
      setIsDrawingArrow(false)
      setCurrentArrow(null)
    }
  }

  useEffect(() => {
    if (lastMove) {
      setArrows([])
      setLastMove(null)
    }
  }, [lastMove])

  const renderPiece = (symbol: string, rowIndex: number, colIndex: number) => {
    if (board) {
      const notation = getNotation(rowIndex, colIndex)
      const square = board.getPositionByNotation(notation)
      if (square?.figure) {
        const piece = square.figure
        const isWhite = piece.color === "white"
        const iconColor = isWhite ? "text-white" : "text-black"
        let IconComponent
        switch (piece.type) {
          case "pawn":
            IconComponent = ChessPawn
            break
          case "rook":
            IconComponent = ChessRook
            break
          case "knight":
            IconComponent = ChessKnight
            break
          case "bishop":
            IconComponent = ChessBishop
            break
          case "queen":
            IconComponent = ChessQueen
            break
          case "king":
            IconComponent = ChessKing
            break
          default:
            return null
        }
        const dropShadow = isWhite ? "drop-shadow(0 0 6px #000)" : "drop-shadow(0 0 6px #fff)"
        return <IconComponent className={clsx("w-[60%] h-[60%] z-10", iconColor)} style={{ filter: dropShadow }} />
      }
    }

    if (!symbol) return null
    const isWhite = symbol === symbol.toUpperCase()
    const iconColor = isWhite ? "text-white" : "text-black"
    let IconComponent
    switch (symbol.toLowerCase()) {
      case "p":
        IconComponent = ChessPawn
        break
      case "r":
        IconComponent = ChessRook
        break
      case "n":
        IconComponent = ChessKnight
        break
      case "b":
        IconComponent = ChessBishop
        break
      case "q":
        IconComponent = ChessQueen
        break
      case "k":
        IconComponent = ChessKing
        break
      default:
        return null
    }
    const dropShadow = isWhite ? "drop-shadow(0 0 6px #000)" : "drop-shadow(0 0 6px #fff)"
    return <IconComponent className={clsx("w-[60%] h-[60%] z-10", iconColor)} style={{ filter: dropShadow }} />
  }

  function isBlackSquare(rowIndex: number, colIndex: number, darkMode: boolean) {
    const isBlack = (rowIndex + colIndex) % 2 === 1
    return isBlack
      ? darkMode
        ? "bg-neutral-400 hover:bg-neutral-500"
        : "bg-gray-400 hover:bg-neutral-500"
      : darkMode
        ? "bg-stone-700 hover:bg-neutral-500"
        : "bg-zinc-200 hover:bg-neutral-500"
  }

  const renderArrow = (arrow: Arrow) => {
    const dx = arrow.end.x - arrow.start.x
    const dy = arrow.end.y - arrow.start.y
    const length = Math.max(1, Math.sqrt(dx * dx + dy * dy)) // Zapewnij minimalną długość 1px
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: arrow.start.x,
          top: arrow.start.y,
          width: length,
          height: 12, // Grubsza linia (zwiększono z 8px na 12px)
          backgroundColor: "rgba(0, 255, 0, 0.7)", // Zielony z opacity 0.7
          transform: `rotate(${angle}deg)`,
          transformOrigin: "0 0",
          borderRadius: "2px", // Lekkie zaokrąglenie dla lepszego wyglądu
        }}
      >
        <div
          className="absolute"
          style={{
            right: -12, // Przesunięcie grota na koniec linii (dostosowane do grubszej linii)
            top: -8, // Dostosowane do grubszej linii
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "18px solid rgba(0, 255, 0, 0.7)", // Zielony grot z opacity 0.7
            transform: `rotate(${angle}deg)`, // Grot zawsze skierowany wzdłuż linii (bez dodatkowego obrotu 180°)
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[68vh] aspect-square">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/30 blur-2xl rounded-3xl" />
        <div className="absolute inset-0 border-4 border-white/50 rounded-3xl" />
      </div>

      <div
        ref={boardRef}
        className={clsx("relative z-10 w-full h-full rounded-xl p-4 shadow-2xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className={clsx("grid grid-cols-8 grid-rows-8 h-full w-full rounded-xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
          {boardRows.map((rowData: string[], rowIndex: number) =>
            rowData.map((symbol, colIndex) => {
              const notation = getNotation(rowIndex, colIndex)
              const square = board?.getPositionByNotation(notation)
              const isSelected = selectedSquare && selectedSquare.notation === notation
              const isValidMove = validMoves.some((pos) => pos.notation === notation)

              let isKingInCheck = false
              if (square?.figure?.type === "king") {
                const isWhite = square.figure.color === "white"
                isKingInCheck = isWhite ? board?.isKingInCheck("white") : board?.isKingInCheck("black")
              }

              const squareBgClasses = isKingInCheck ? "bg-red-500 hover:bg-red-600 rounded-sm" : isBlackSquare(rowIndex, colIndex, isDarkMode)

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                  className={clsx("relative flex items-center justify-center", squareBgClasses)}
                >
                  {isValidMove && (
                    <>
                      {square?.figure && square.figure.color !== currentPlayer ? (
                        <div className="absolute inset-0 bg-green-600 opacity-40 pointer-events-none rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md m-2" />
                      ) : (
                        <div
                          className={clsx(
                            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[18%] h-[18%] rounded-full pointer-events-none",
                            isDarkMode ? "bg-white" : "bg-gray-600",
                          )}
                        />
                      )}
                    </>
                  )}

                  {isSelected && (
                    <div
                      className="absolute inset-0 border-t-[5px] border-l-[5px] border-blue-500 
                 rounded-tl-md rounded-tr-sm rounded-bl-sm rounded-br-none pointer-events-none z-0"
                    />
                  )}

                  {renderPiece(symbol, rowIndex, colIndex)}
                </div>
              )
            }),
          )}
        </div>
        {arrows.map((arrow, index) => (
          <React.Fragment key={index}>{renderArrow(arrow)}</React.Fragment>
        ))}
        {currentArrow && renderArrow(currentArrow)}
      </div>
    </div>
  )
}
