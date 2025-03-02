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
import { isMoveEnPassant } from "@chess-engine/functions"

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

export function ChessBoard2D() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const { board, movePiece, getValidMoves, currentPlayer, isMoveEnPassant: checkEnPassant } = useGameContext()

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [arrowStart, setArrowStart] = useState<Position | null>(null)
  const [arrows, setArrows] = useState<ArrowData[]>([])

  // Nowy stan do obsługi rysowania strzałki (drag-and-drop)
  const [isDrawingArrow, setIsDrawingArrow] = useState<boolean>(false)

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

  // STARA funkcja do rysowania strzałki na 2 kliknięcia:
  // (Pozostawiona w kodzie, ale nieużywana w <div>)
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
    setSelectedSquare(null)
  }

  // NOWA logika – rysowanie strzałki przy przeciągnięciu prawego przycisku myszy:
  const handleMouseDownSquare = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    // e.button === 2 => prawy przycisk myszy
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
    // Zwalniamy prawy przycisk
    if (e.button === 2) {
      e.preventDefault()
      if (!board) return

      // Jeżeli jesteśmy w trakcie rysowania i mamy punkt startowy...
      if (isDrawingArrow && arrowStart) {
        const notation = getNotation(rowIndex, colIndex)
        const square = board.getPositionByNotation(notation)
        if (!square) return

        const extendedSquare: Position = { ...square, rowIndex, colIndex }
        setArrows((prev) => [...prev, { start: arrowStart, end: extendedSquare }])
      }

      // Resetujemy stan rysowania
      setArrowStart(null)
      setIsDrawingArrow(false)
      setSelectedSquare(null)
    }
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
    const isBlack = (rowIndex + colIndex) % 2 === 0
    return isBlack
      ? darkMode
        ? "bg-neutral-400 hover:bg-neutral-500"
        : "bg-gray-400 hover:bg-neutral-500"
      : darkMode
        ? "bg-stone-700 hover:bg-neutral-500"
        : "bg-zinc-200 hover:bg-neutral-500"
  }

  function renderArrows() {
    return arrows.map((arrow, index) => {
      const { start, end } = arrow

      // Pozycje w % (każde pole to 12.5% w pionie/poziomie)
      const startTop = (start.rowIndex ?? 0) * 12.5 + 6.25
      const startLeft = (start.colIndex ?? 0) * 12.5 + 6.25
      const endTop = (end.rowIndex ?? 0) * 12.5 + 6.25
      const endLeft = (end.colIndex ?? 0) * 12.5 + 6.25

      // Różnice w indeksach pól (ile "pól" w pionie/poziomie)
      const rowDiff = Math.abs((start.rowIndex ?? 0) - (end.rowIndex ?? 0))
      const colDiff = Math.abs((start.colIndex ?? 0) - (end.colIndex ?? 0))

      // Kolor, grubość i ogólne style strzałki
      const arrowColor = "rgba(255, 165, 0, 0.8)" // lekka przezroczystość
      const lineThickness = 12 // pogrubione

      // Wspólne do L-kształtu
      const verticalTop = Math.min(startTop, endTop)
      const verticalHeight = Math.abs(endTop - startTop)
      const horizontalLeft = Math.min(startLeft, endLeft)
      const horizontalWidth = Math.abs(endLeft - startLeft)
      const cornerTop = endTop
      const cornerLeft = startLeft

      // Definicje stylów L-kształtu (pion + poziom + grot)
      const verticalStyle: React.CSSProperties = {
        position: "absolute",
        backgroundColor: arrowColor,
        width: `${lineThickness}px`,
        top: `${verticalTop}%`,
        left: `${startLeft}%`,
        height: `${verticalHeight}%`,
        transform: "translate(-50%, 0)",
        borderRadius: "4px",
        zIndex: 50,
      }
      const horizontalStyle: React.CSSProperties = {
        position: "absolute",
        backgroundColor: arrowColor,
        height: `${lineThickness}px`,
        top: `${cornerTop}%`,
        left: `${horizontalLeft}%`,
        width: `${horizontalWidth}%`,
        transform: "translate(0, -50%)",
        borderRadius: "4px",
        zIndex: 50,
      }

      const arrowHeadSize = 18
      let arrowRotation = 0
      if (endLeft > cornerLeft) {
        arrowRotation = 90 // w prawo
      } else if (endLeft < cornerLeft) {
        arrowRotation = -90 // w lewo
      } else {
        if (endTop > startTop) {
          arrowRotation = 180 // w dół
        } else {
          arrowRotation = 0 // w górę
        }
      }
      const arrowHeadStyleL: React.CSSProperties = {
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: `${arrowHeadSize / 2}px solid transparent`,
        borderRight: `${arrowHeadSize / 2}px solid transparent`,
        borderBottom: `${arrowHeadSize}px solid ${arrowColor}`,
        top: `${endTop}%`,
        left: `${endLeft}%`,
        transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
        zIndex: 50,
      }

      // Jeśli strzałka jest "duża" (rowDiff > 2 i colDiff > 1),
      // rysujemy pojedynczą linię pod kątem, zamiast L-kształtu.
      if (rowDiff > 2 && colDiff > 1) {
        // Wyliczamy odległość i kąt w stopniach (standard math: 0 => w prawo, 90 => w górę)
        const deltaX = endLeft - startLeft
        const deltaY = endTop - startTop
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI

        // Środek linii – w połowie drogi
        const midTop = (startTop + endTop) / 2
        const midLeft = (startLeft + endLeft) / 2

        // Styl pojedynczej ukośnej linii
        const diagonalSegmentStyle: React.CSSProperties = {
          position: "absolute",
          backgroundColor: arrowColor,
          height: `${lineThickness}px`,
          width: `${distance}%`,
          top: `${midTop}%`,
          left: `${midLeft}%`,
          transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
          transformOrigin: "center",
          borderRadius: "4px",
          zIndex: 50,
        }

        // Grot na końcu – definiujemy go jako "strzałkę w prawo" (borderRight),
        // bo wtedy rotate(angleDeg) idealnie pokryje się z linią.
        const arrowHeadStyleDiagonal: React.CSSProperties = {
          position: "absolute",
          width: 0,
          height: 0,
          borderTop: `${arrowHeadSize / 2}px solid transparent`,
          borderBottom: `${arrowHeadSize / 2}px solid transparent`,
          borderRight: `${arrowHeadSize}px solid ${arrowColor}`, // Grot w prawo
          top: `${endTop}%`,
          left: `${endLeft}%`,
          transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
          zIndex: 50,
        }

        return (
          <React.Fragment key={index}>
            {/* Pojedyncza linia ukośna */}
            <div style={diagonalSegmentStyle} />
            {/* Grot (idealnie dopasowany do kąta) */}
            <div style={arrowHeadStyleDiagonal} />
          </React.Fragment>
        )
      } else {
        // Dla "krótkich" strzałek zostaje nasz stary L-kształt
        return (
          <React.Fragment key={index}>
            {verticalHeight > 0 && <div style={verticalStyle} />}
            {horizontalWidth > 0 && <div style={horizontalStyle} />}
            <div style={arrowHeadStyleL} />
          </React.Fragment>
        )
      }
    })
  }

  return (
    <div className="relative w-full max-w-[68vh] aspect-square">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/30 blur-2xl rounded-3xl" />
        <div className="absolute inset-0 border-4 border-white/50 rounded-3xl" />
      </div>

      <div className={clsx("relative z-10 w-full h-full rounded-xl p-4 shadow-2xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
        {renderArrows()}

        <div className={clsx("grid grid-cols-8 grid-rows-8 h-full w-full rounded-xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
          {boardRows.map((rowData: string[], rowIndex: number) =>
            rowData.map((symbol, colIndex) => {
              const notation = getNotation(rowIndex, colIndex)
              const square = board?.getPositionByNotation(notation)
              const isSelected = selectedSquare && selectedSquare.notation === notation
              const isValidMove = validMoves.some((pos) => pos.notation === notation)

              // Sprawdzamy, czy ruch na to pole to en passant
              const isEnPassantMove = selectedSquare && checkEnPassant({ from: selectedSquare, to: square })

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
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseDown={(e) => handleMouseDownSquare(e, rowIndex, colIndex)}
                  onMouseUp={(e) => handleMouseUpSquare(e, rowIndex, colIndex)}
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

                  {/* Specjalne podświetlenie dla en passant */}
                  {isEnPassantMove && (
                    <div
                      className={clsx("absolute inset-0 bg-yellow-500 opacity-50 pointer-events-none rounded-md", "border-2 border-dashed border-yellow-700")}
                    />
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
      </div>
    </div>
  )
}
