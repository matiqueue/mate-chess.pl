import { useState } from "react"
import { useGameContext } from "@/contexts/GameContext"
import { Position, ArrowData } from "@/utils/chessboard/types"

// Funkcja narzędziowa do generowania notacji szachowej
export function getNotation(rowIndex: number, colIndex: number): string {
  const letters = "abcdefgh"
  const rank = 8 - rowIndex
  const file = letters.charAt(colIndex)
  return file + rank
}

export function useChessBoardInteractions() {
  const { board, movePiece, getValidMoves, currentPlayer, isPreviewMode } = useGameContext()
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [showPreviewAlert, setShowPreviewAlert] = useState(false)

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

  return { selectedSquare, validMoves, handleSquareClick, showPreviewAlert }
}

// Hook do obsługi strzałek na szachownicy
export function useChessArrows() {
  const { board } = useGameContext()
  const [arrowStart, setArrowStart] = useState<Position | null>(null)
  const [arrows, setArrows] = useState<ArrowData[]>([])
  const [isDrawingArrow, setIsDrawingArrow] = useState<boolean>(false)

  const handleMouseDownSquare = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    if (e.button === 2) {
      e.preventDefault()
      if (!board) return

      const notation = getNotation(rowIndex, colIndex)
      const square = board.getPositionByNotation(notation)
      if (!square) return

      const extendedSquare: Position = { ...square, rowIndex, colIndex }
      setArrowStart(extendedSquare)
      setIsDrawingArrow(true)
    }
  }

  const handleMouseUpSquare = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    if (e.button === 2) {
      e.preventDefault()
      if (!board) return

      if (isDrawingArrow && arrowStart) {
        const notation = getNotation(rowIndex, colIndex)
        if (arrowStart.rowIndex === rowIndex && arrowStart.colIndex === colIndex) {
          // Ignoruj klik w to samo pole
        } else if (arrowStart.notation !== notation) {
          const square = board.getPositionByNotation(notation)
          if (!square) return

          const extendedSquare: Position = { ...square, rowIndex, colIndex }
          setArrows((prev) => [...prev, { start: arrowStart, end: extendedSquare }])
        }
      }

      setArrowStart(null)
      setIsDrawingArrow(false)
    }
  }

  return {
    arrows,
    handleMouseDownSquare,
    handleMouseUpSquare,
    clearArrows: () => setArrows([]), // Dodatkowa funkcja do czyszczenia strzałek
  }
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
