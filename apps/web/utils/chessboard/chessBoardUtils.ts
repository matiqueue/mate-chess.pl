import { useState } from "react"
import { useGameContext } from "@/contexts/GameContext"

interface Position {
  notation: string
  figure: { type: string; color: string } | null
  rowIndex?: number
  colIndex?: number
}

interface ArrowData {
  start: Position
  end: Position
}

// Funkcja narzędziowa do generowania notacji szachowej
export function getNotation(rowIndex: number, colIndex: number): string {
  const letters = "abcdefgh"
  const rank = 8 - rowIndex
  const file = letters.charAt(colIndex)
  return file + rank
}

// Hook do obsługi interakcji z szachownicą (wybór pól, ruchy)
export function useChessBoardInteractions() {
  const { board, movePiece, getValidMoves, currentPlayer } = useGameContext()
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])

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

  return { selectedSquare, validMoves, handleSquareClick }
}

// Hook do obsługi strzałek na szachownicy
export function useChessArrows() {
  const { board } = useGameContext()
  const [arrowStart, setArrowStart] = useState<Position | null>(null)
  const [arrows, setArrows] = useState<ArrowData[]>([])

  const handleSquareRightClick = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault()
    if (!board) return

    const notation = getNotation(rowIndex, colIndex)
    const square = board.getPositionByNotation(notation)
    if (!square) return

    const extendedSquare: Position = { ...square, rowIndex, colIndex }

    if (!arrowStart) {
      setArrowStart(extendedSquare)
      return
    }

    setArrows((prev) => [...prev, { start: arrowStart, end: extendedSquare }])
    setArrowStart(null)
  }

  return { arrows, handleSquareRightClick }
}

// Funkcja określająca kolor pola na podstawie pozycji i trybu ciemnego
export function isBlackSquare(rowIndex: number, colIndex: number, isDarkMode: boolean): string {
  const isBlack = (rowIndex + colIndex) % 2 === 0
  return isBlack
    ? isDarkMode
      ? "bg-neutral-400 hover:bg-neutral-500"
      : "bg-gray-400 hover:bg-neutral-500"
    : isDarkMode
      ? "bg-stone-700 hover:bg-neutral-500"
      : "bg-zinc-200 hover:bg-neutral-500"
}
