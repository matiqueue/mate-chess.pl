"use client"

import {
  FaChessRook as ChessRook,
  FaChessKnight as ChessKnight,
  FaChessBishop as ChessBishop,
  FaChessQueen as ChessQueen,
  FaChessKing as ChessKing,
} from "react-icons/fa"

import Board from "@modules/chess/board/board"
import Position from "@modules/chess/position"
import { SiChessdotcom as ChessPawn } from "react-icons/si"
import { useTheme } from "next-themes"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import chessGameExtraLayer from "@modules/chessGameExtraLayer"
import { getBoard, getPositionByCords, getValidMoves, makeMove, rewindMove, setupGame, startGame, whosTurn } from "@modules/index"
import { color } from "@chess-engine/types"
import { getBoardArray } from "@shared/destruct/mallocFunctions/positonMapping"

export function ChessBoard() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const [board, setBoard] = useState<Board>()
  const gameInstanceRef = useRef<chessGameExtraLayer>(setupGame())

  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [turn, setTurn] = useState<color>(whosTurn(gameInstanceRef.current))
  const [initialBoard, setInitialBoard] = useState(Array(8).fill(Array(8).fill("")))

  // ODPALA SIE TYLKO RAZ, NA POCZĄTKU GRY
  useEffect(() => {
    if (!gameInstanceRef.current) {
      return
    }
    startGame(gameInstanceRef.current)
    const board = getBoard(gameInstanceRef.current)
    setBoard(board)
    setInitialBoard(getBoardArray(board))
    console.log(initialBoard)
  }, [])

  useEffect(() => {
    if (!board) return
    setInitialBoard(getBoardArray(board))
    return
    // reviewing required because ML is unsure if that's correct way to use useEffect.
    // previously there was [initalBoard] but it caused endless loop resulting in memory leak in browser
  }, [turn])

  const handleBoardClick = (x: number, y: number) => {
    if (!board) return

    const clickedPosition = getPositionByCords(board, x, y)
    if (!clickedPosition) return

    const clickedFigure = clickedPosition.figure
    if (clickedFigure && clickedFigure.color === turn) {
      setSelectedPos(clickedPosition)
      setValidMoves(getValidMoves(board, clickedPosition))
      return
    }
    if (!selectedPos) {
      setSelectedPos(clickedPosition)
      setValidMoves(getValidMoves(board, clickedPosition))
      return
    } else {
      const move = {
        from: selectedPos,
        to: clickedPosition,
      }
      makeMove(gameInstanceRef.current, move)
    }

    const updatedBoard = getBoard(gameInstanceRef.current)
    setBoard(updatedBoard)

    // setBoard(getBoard(gameInstanceRef.current)) //nie wiem na chuj to dodawałem w ogóle?
    setTurn(whosTurn(gameInstanceRef.current))
    setSelectedPos(null)
    setValidMoves([])
  }
  const handleRewind = () => {
    rewindMove(gameInstanceRef.current)
    const updatedBoard = getBoard(gameInstanceRef.current)
    setBoard(updatedBoard)
    setTurn(whosTurn(gameInstanceRef.current))
    setSelectedPos(null)
    setValidMoves([])
  }
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
              const position: Position | null = board ? getPositionByCords(board, colIndex, rowIndex - 1) : null

              const isSelected = selectedPos && position && selectedPos.notation === position.notation
              const isValidMove = validMoves.some((move) => move.notation === position?.notation)

              const isOpponentMove = selectedPos?.figure?.color !== turn

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    transition: "none",
                    willChange: "background-color",
                    contain: "paint",
                  }}
                  className={clsx(
                    isSelected
                      ? "bg-blue-300"
                      : isValidMove
                        ? isOpponentMove
                          ? "bg-gray-500"
                          : "bg-green-300"
                        : isBlack
                          ? isDarkMode
                            ? "bg-neutral-400 hover:bg-neutral-500"
                            : "bg-gray-400 hover:bg-neutral-500"
                          : isDarkMode
                            ? "bg-stone-700 hover:bg-neutral-500"
                            : "bg-zinc-200 hover:bg-neutral-500",
                    "relative flex items-center justify-center",
                  )}
                  onClick={() => handleBoardClick(colIndex, rowIndex - 1)}
                >
                  {getPieceIcon(piece)}
                </div>
              )
            }),
          )}
        </div>
      </div>
      {/*JUST FOR TESTING*/}
      <button onClick={handleRewind}>REWIND TEST</button>
    </div>
  )
}
