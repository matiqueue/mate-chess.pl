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
import { Position, ArrowData } from "@/utils/chessboard/types"
import { useChessBoardInteractions, useChessArrows, isBlackSquare, getNotation } from "@/utils/chessboard/chessBoardUtils"

export function ChessBoard2D() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const { board, currentPlayer, isMoveEnPassant: checkEnPassant } = useGameContext()

  const { selectedSquare, validMoves, handleSquareClick } = useChessBoardInteractions()
  const { arrows, handleMouseDownSquare, handleMouseUpSquare, clearArrows } = useChessArrows()

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

  // Nadpisz handleSquareClick, aby czyścić strzałki po ruchu
  const handleSquareClickWithArrows = (rowIndex: number, colIndex: number) => {
    const notation = getNotation(rowIndex, colIndex)
    const square = board?.getPositionByNotation(notation)
    if (selectedSquare && validMoves.some((pos) => pos.notation === square?.notation)) {
      clearArrows()
    }
    handleSquareClick(rowIndex, colIndex)
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

  function renderArrows() {
    const arrowColorSolid = "#ffa500"
    const arrowContainerBase: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      opacity: 0.6,
      zIndex: 50,
    }

    return arrows.map((arrow, index) => {
      const { start, end } = arrow

      // Każde pole = 12.5%, 6.25% to środek
      const startTop = (start.rowIndex ?? 0) * 12.5 + 6.25
      const startLeft = (start.colIndex ?? 0) * 12.5 + 6.25
      const endTop = (end.rowIndex ?? 0) * 12.5 + 6.25
      const endLeft = (end.colIndex ?? 0) * 12.5 + 6.25

      const rowDiff = Math.abs((start.rowIndex ?? 0) - (end.rowIndex ?? 0))
      const colDiff = Math.abs((start.colIndex ?? 0) - (end.colIndex ?? 0))

      const lineThickness = 18
      const arrowHeadSize = 40

      if (rowDiff === colDiff) {
        const deltaX = endLeft - startLeft
        const deltaY = endTop - startTop
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI

        const midTop = (startTop + endTop) / 2
        const midLeft = (startLeft + endLeft) / 2

        const diagonalSegmentStyle: React.CSSProperties = {
          position: "absolute",
          backgroundColor: arrowColorSolid,
          height: `${lineThickness}px`,
          width: `${distance}%`,
          top: `${midTop}%`,
          left: `${midLeft}%`,
          transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
          transformOrigin: "center",
          borderRadius: "8px",
        }

        const arrowHeadStyleDiagonal: React.CSSProperties = {
          position: "absolute",
          width: 0,
          height: 0,
          borderTop: `${arrowHeadSize / 2}px solid transparent`,
          borderBottom: `${arrowHeadSize / 2}px solid transparent`,
          borderRight: `${arrowHeadSize}px solid ${arrowColorSolid}`,
          top: `${endTop}%`,
          left: `${endLeft}%`,
          transform: `translate(-50%, -50%) rotate(${angleDeg + 180}deg)`,
        }

        return (
          <div key={index} style={arrowContainerBase}>
            <div style={diagonalSegmentStyle} />
            <div style={arrowHeadStyleDiagonal} />
          </div>
        )
      } else {
        const verticalTop = Math.min(startTop, endTop)
        const verticalHeight = Math.abs(endTop - startTop)
        const horizontalLeft = Math.min(startLeft, endLeft)
        const horizontalWidth = Math.abs(endLeft - startLeft)

        const cornerTop = endTop
        const cornerLeft = startLeft

        const verticalStyle: React.CSSProperties = {
          position: "absolute",
          backgroundColor: arrowColorSolid,
          width: `${lineThickness}px`,
          top: `${verticalTop}%`,
          left: `${startLeft}%`,
          height: `${verticalHeight}%`,
          transform: "translate(-50%, 0)",
          borderRadius: "10px",
        }

        const horizontalStyle: React.CSSProperties = {
          position: "absolute",
          backgroundColor: arrowColorSolid,
          height: `${lineThickness}px`,
          top: `${cornerTop}%`,
          left: `${horizontalLeft}%`,
          width: `${horizontalWidth}%`,
          transform: "translate(0, -50%)",
          borderRadius: "4px",
        }

        const cornerConnectorStyle: React.CSSProperties = {
          position: "absolute",
          backgroundColor: arrowColorSolid,
          width: `${lineThickness}px`,
          height: `${lineThickness}px`,
          top: `${cornerTop}%`,
          left: `${cornerLeft}%`,
          transform: "translate(-50%, -50%)",
          borderRadius: "8px",
        }

        let arrowRotation = 0
        if (endLeft > cornerLeft) {
          arrowRotation = 90
        } else if (endLeft < cornerLeft) {
          arrowRotation = -90
        } else {
          if (endTop > startTop) {
            arrowRotation = 180
          } else {
            arrowRotation = 0
          }
        }

        const arrowHeadStyleL: React.CSSProperties = {
          position: "absolute",
          width: 0,
          height: 0,
          borderLeft: `${arrowHeadSize / 2}px solid transparent`,
          borderRight: `${arrowHeadSize / 2}px solid transparent`,
          borderBottom: `${arrowHeadSize}px solid ${arrowColorSolid}`,
          top: `${endTop}%`,
          left: `${endLeft}%`,
          transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
        }

        return (
          <div key={index} style={arrowContainerBase}>
            {verticalHeight > 0 && <div style={verticalStyle} />}
            {horizontalWidth > 0 && <div style={horizontalStyle} />}
            <div style={cornerConnectorStyle} />
            <div style={arrowHeadStyleL} />
          </div>
        )
      }
    })
  }

  return (
    <div className="relative w-full max-w-[68vh] aspect-square">
      <div className={clsx("p-4 bg-white/30 rounded-3xl shadow-2xl", isDarkMode ? "bg-stone-600/30" : "bg-gray-300/30")}>
        <div className={clsx("relative z-10 w-full aspect-square rounded-xl shadow-2xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
          <div className="relative w-full h-full box-border">
            <div className="absolute inset-0 pointer-events-none">{renderArrows()}</div>
            <div className={clsx("grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
              {boardRows.map((rowData: string[], rowIndex: number) =>
                rowData.map((symbol, colIndex) => {
                  const notation = getNotation(rowIndex, colIndex)
                  const square = board?.getPositionByNotation(notation)
                  const isSelected = selectedSquare && selectedSquare.notation === notation
                  const isValidMove = validMoves.some((pos) => pos.notation === notation)
                  const isEnPassantMove = selectedSquare && checkEnPassant({ from: selectedSquare, to: square })

                  let isKingInCheck = false
                  if (square?.figure?.type === "king") {
                    const isWhite = square.figure.color === "white"
                    isKingInCheck = isWhite ? board?.isKingInCheck("white") : board?.isKingInCheck("black")
                  }

                  const squareBgClasses = isKingInCheck ? "bg-red-500 hover:bg-red-600" : isBlackSquare(rowIndex, colIndex, isDarkMode)

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClickWithArrows(rowIndex, colIndex)}
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseDown={(e) => handleMouseDownSquare(e, rowIndex, colIndex)}
                      onMouseUp={(e) => handleMouseUpSquare(e, rowIndex, colIndex)}
                      className={clsx("relative flex items-center justify-center", squareBgClasses)}
                    >
                      {isValidMove && (
                        <>
                          {square?.figure && square.figure.color !== currentPlayer ? (
                            <div className="absolute inset-0 bg-green-600 opacity-40 pointer-events-none m-2 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md" />
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

                      {isEnPassantMove && (
                        <div
                          className={clsx(
                            "absolute inset-0 bg-yellow-500 opacity-50 pointer-events-none rounded-md",
                            "border-2 border-dashed border-yellow-700",
                          )}
                        />
                      )}

                      {isSelected && <div className="absolute inset-0 border-t-[5px] border-l-[5px] border-blue-500 pointer-events-none z-0 rounded-tl-md" />}

                      {renderPiece(symbol, rowIndex, colIndex)}
                    </div>
                  )
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
