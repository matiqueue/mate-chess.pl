/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
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

export function ChessBoard() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Hook z silnika
  const { board, movePiece, getValidMoves, currentPlayer } = useGameContext()

  // Lokalne stany
  const [selectedSquare, setSelectedSquare] = useState<any>(null)
  const [validMoves, setValidMoves] = useState<any[]>([])

  // Domyślna plansza (gdy silnik niegotowy)
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

  // Tablica z silnika (9 wierszy, pierwszy pusty)
  const rawBoard = board ? board.getBoardArray() : (initialBoard as [string[]])
  // Usuwamy pierwszy pusty wiersz
  const boardRows = rawBoard.slice(1) // teraz 8 wierszy, 0..7

  // Sprawdzamy, czy król w szachu
  // const whiteInCheck = board?.isKingInCheck("white") ?? false
  // const blackInCheck = board?.isKingInCheck("black") ?? false

  /**
   * Oblicza notację (np. "a8") na podstawie wiersza i kolumny.
   * Tutaj rowIndex=0 => górny wiersz, rowIndex=7 => dolny.
   * colIndex=0 => lewa kolumna, colIndex=7 => prawa.
   * Silnik w `setupBoard()` ustawia y=0 jako górę (rank=8), y=7 jako dół (rank=1).
   * Więc rank = 8 - rowIndex, file = letters[7 - colIndex].
   */
  const getNotation = (rowIndex: number, colIndex: number) => {
    const letters = "abcdefgh"
    const rank = 8 - rowIndex
    const file = letters.charAt(7 - colIndex)
    return file + rank
  }

  // Kliknięcie w pole
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

  /**
   * Render figury. Jeśli silnik jest gotowy, pobieramy info z `board`.
   * W przeciwnym razie używamy symbolu z initialBoard.
   */
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

  // Funkcja pomocnicza do określenia koloru tła dla zwykłych pól
  function isBlackSquare(rowIndex: number, colIndex: number, darkMode: boolean) {
    const isBlack = (rowIndex + colIndex) % 2 === 1
    if (isBlack) {
      return darkMode ? "bg-neutral-400 hover:bg-neutral-500" : "bg-gray-400 hover:bg-neutral-500"
    } else {
      return darkMode ? "bg-stone-700 hover:bg-neutral-500" : "bg-zinc-200 hover:bg-neutral-500"
    }
  }

  return (
    <div className="relative w-full max-w-[68vh] aspect-square">
      {/* Overlay z rozmyciem i obramowaniem */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/30 blur-2xl rounded-3xl" />
        <div className="absolute inset-0 border-4 border-white/50 rounded-3xl" />
      </div>

      <div className={clsx("relative z-10 w-full h-full rounded-xl p-4 shadow-2xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
        <div className={clsx("grid grid-cols-8 grid-rows-8 h-full w-full rounded-xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
          {boardRows.map((rowData: any[], rowIndex: number) =>
            rowData.map((_, colIndex) => {
              // Pobieramy symbol (odwracamy kolumny)
              const symbol = rowData[7 - colIndex]
              const notation = getNotation(rowIndex, colIndex)
              const square = board?.getPositionByNotation(notation)
              const isSelected = selectedSquare && selectedSquare.notation === notation
              const isValidMove = validMoves.some((pos) => pos.notation === notation)

              // Sprawdzamy, czy to pole zawiera króla w szachu
              let isKingInCheck = false
              if (square?.figure?.type === "king") {
                const isWhite = square.figure.color === "white"
                if (isWhite && board?.isKingInCheck("white")) {
                  isKingInCheck = true
                }
                if (!isWhite && board?.isKingInCheck("black")) {
                  isKingInCheck = true
                }
              }

              // Określamy kolor tła pola.
              // Dla pól z królem w szachu: czerwone tło z lekkim roundingiem (bez czarnego border).
              const squareBgClasses = isKingInCheck ? "bg-red-500 hover:bg-red-600 rounded-sm" : isBlackSquare(rowIndex, colIndex, isDarkMode)

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
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

                  {/* Nakładka z niebieskim borderem, która nie wpływa na rozmiar figury */}
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
      </div>
    </div>
  )
}
