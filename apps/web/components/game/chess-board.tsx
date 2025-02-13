"use client"

import {
  FaChessRook as ChessRook,
  FaChessKnight as ChessKnight,
  FaChessBishop as ChessBishop,
  FaChessQueen as ChessQueen,
  FaChessKing as ChessKing,
} from "react-icons/fa"

import { SiChessdotcom as ChessPawn } from "react-icons/si";


export function ChessBoard() {
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

  const getPieceIcon = (piece: string) => {
    const isWhite = piece === piece.toUpperCase()
    const className = `w-8 h-8 ${isWhite ? "text-white" : "text-zinc-900"}`

    switch (piece.toLowerCase()) {
      case "p":
        return <ChessPawn className={className} />
      case "r":
        return <ChessRook className={className} />
      case "n":
        return <ChessKnight className={className} />
      case "b":
        return <ChessBishop className={className} />
      case "q":
        return <ChessQueen className={className} />
      case "k":
        return <ChessKing className={className} />
      default:
        return null
    }
  }

  return (
    <div className="relative w-full max-w-[68vh] aspect-square">
      <div className="absolute inset-0 bg-black/20 blur-2xl rounded-3xl" />
      <div className="relative w-full h-full bg-zinc-600 rounded-xl p-4 shadow-2xl">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-[1px] bg-zinc-400 p-[1px- rounded-xl">
          {initialBoard.flatMap((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isBlack = (rowIndex + colIndex) % 2 === 1
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${
                    isBlack ? "bg-zinc-600" : "bg-zinc-300"
                  } relative transition-all duration-300 hover:bg-blue-400/30 flex items-center justify-center`}
                >
                  {getPieceIcon(piece)}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}

