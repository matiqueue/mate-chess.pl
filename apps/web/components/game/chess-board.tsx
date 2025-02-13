"use client"

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

export function ChessBoard() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

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
    if (!piece) return null
    const isWhite = piece === piece.toUpperCase()
    const iconColor = isWhite ? "text-white" : "text-neutral-800"
    const baseClasses = "w-[60%] h-[60%]"
    let IconComponent

    switch (piece.toLowerCase()) {
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

    const dropShadowValue = isWhite
      ? `drop-shadow(0 0 6px #000)` // dla białych figur – mocniejszy czarny cień
      : `drop-shadow(0 0 6px #fff)` // dla czarnych figur – mocniejszy biały cień

    return <IconComponent className={clsx(baseClasses, iconColor)} style={{ filter: dropShadowValue }} />
  }

  return (
    <div className="relative w-full max-w-[68vh] aspect-square">
      {/* Overlay z rozmyciem i obramowaniem – pointer-events-none nie blokuje eventów */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/30 blur-2xl rounded-3xl" />
        <div className="absolute inset-0 border-4 border-white/50 rounded-3xl" />
      </div>
      {/* Plansza z wyższym z-index */}
      <div className={`relative z-10 w-full h-full ${isDarkMode ? "bg-stone-600" : "bg-gray-300"} rounded-xl p-4 shadow-2xl`}>
        <div className={`grid grid-cols-8 grid-rows-8 h-full w-full ${isDarkMode ? "bg-stone-600" : "bg-gray-300"} rounded-xl`}>
          {initialBoard.flatMap((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isBlack = (rowIndex + colIndex) % 2 === 1
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    transition: "none",
                    willChange: "background-color",
                    contain: "paint",
                  }}
                  className={clsx(
                    isBlack
                      ? isDarkMode
                        ? "bg-neutral-400 hover:bg-neutral-500"
                        : "bg-gray-400 hover:bg-neutral-500"
                      : isDarkMode
                        ? "bg-stone-700 hover:bg-neutral-500"
                        : "bg-zinc-200 hover:bg-neutral-500",
                    "relative flex items-center justify-center",
                  )}
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
