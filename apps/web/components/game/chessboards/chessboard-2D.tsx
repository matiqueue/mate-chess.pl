"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import React, { useEffect, useState } from "react" // React i hooki do efektów oraz stanu
import {
  FaChessRook as ChessRook,
  FaChessKnight as ChessKnight,
  FaChessBishop as ChessBishop,
  FaChessQueen as ChessQueen,
  FaChessKing as ChessKing,
} from "react-icons/fa" // Ikony figur szachowych
import { SiChessdotcom as ChessPawn } from "react-icons/si" // Ikona pionka
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import clsx from "clsx" // Biblioteka do łączenia klas CSS
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej
import { Position, ArrowData } from "@/utils/chessboard/types" // Typy pozycji i strzałek
import { useChessBoardInteractions, useChessArrows, isBlackSquare, getNotation } from "@/utils/chessboard/chessBoardUtils" // Hooki i utils do szachownicy
import LoadingAnimation from "./loading/loading-animation" // Komponent animacji ładowania
import { motion } from "framer-motion" // Biblioteka do animacji

/**
 * ChessBoard2DProps
 *
 * Interfejs definiujący właściwości komponentu ChessBoard2D.
 *
 * @property {string} title - Tytuł wyświetlany podczas ładowania.
 * @property {string} desc - Opis wyświetlany podczas ładowania.
 * @property {string} selectedColor - Wybrany kolor gracza ("white" lub "black").
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface ChessBoard2DProps {
  title: string
  desc: string
  selectedColor: string
}

/**
 * ChessBoard2D
 *
 * Komponent szachownicy 2D, renderujący planszę szachową z figurami, strzałkami i interakcjami.
 * Obsługuje wybór pól, ruchy, strzałki i wizualizację szacha.
 *
 * @param {ChessBoard2DProps} props - Właściwości komponentu, w tym tytuł, opis i wybrany kolor.
 * @returns {JSX.Element} Element JSX reprezentujący szachownicę 2D.
 *
 * @remarks
 * Komponent dynamicznie renderuje figury na podstawie stanu gry z kontekstu, z obsługą animacji ładowania,
 * strzałek i wizualizacji ruchów. Stylizacja dostosowuje się do motywu (jasny/ciemny) i wybranego koloru.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function ChessBoard2D({ title, desc, selectedColor }: ChessBoard2DProps) {
  const { theme } = useTheme() // Hook do pobierania motywu
  const isDarkMode = theme === "dark" // Czy motyw jest ciemny
  const [modelsLoaded, setModelsLoaded] = useState(false) // Stan ładowania modeli

  const { board, currentPlayer, isMoveEnPassant: checkEnPassant } = useGameContext() // Dane gry z kontekstu

  const { selectedSquare, validMoves, handleSquareClick } = useChessBoardInteractions() // Hook do interakcji z szachownicą
  const { arrows, handleMouseDownSquare, handleMouseUpSquare, clearArrows } = useChessArrows() // Hook do zarządzania strzałkami

  const [isDrawingArrow, setIsDrawingArrow] = useState<boolean>(false) // Czy rysowana jest strzałka

  // Początkowa plansza szachowa
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

  // Symulacja ładowania modeli
  useEffect(() => {
    setTimeout(() => {
      setModelsLoaded(true) // Ustawia flagę po 1,5 sekundy
    }, 1500)
  }, [])

  const rawBoard = board ? board.getBoardArray() : initialBoard // Aktualna plansza lub domyślna
  const boardRows = rawBoard.slice(rawBoard.length - 8) // Ostatnie 8 rzędów planszy

  /**
   * handleSquareClickWithArrows
   *
   * Funkcja obsługująca kliknięcie na pole z dodatkowym czyszczeniem strzałek po wykonaniu ruchu.
   *
   * @param {number} rowIndex - Indeks rzędu.
   * @param {number} colIndex - Indeks kolumny.
   */
  const handleSquareClickWithArrows = (rowIndex: number, colIndex: number) => {
    const notation = getNotation(rowIndex, colIndex)
    const square = board?.getPositionByNotation(notation)
    if (selectedSquare && validMoves.some((pos) => pos.notation === square?.notation)) {
      clearArrows() // Czyści strzałki po wykonaniu ruchu
    }
    handleSquareClick(rowIndex, colIndex) // Wywołuje standardową obsługę kliknięcia
  }

  /**
   * renderPiece
   *
   * Funkcja renderująca ikonę figury szachowej na podstawie symbolu lub danych z kontekstu gry.
   *
   * @param {string} symbol - Symbol figury (np. "P" dla białego pionka).
   * @param {number} rowIndex - Indeks rzędu.
   * @param {number} colIndex - Indeks kolumny.
   * @returns {JSX.Element | null} Ikona figury lub null, jeśli brak figury.
   */
  const renderPiece = (symbol: string, rowIndex: number, colIndex: number) => {
    if (board) {
      const notation = getNotation(rowIndex, colIndex)
      const square = board.getPositionByNotation(notation)
      if (square?.figure) {
        const piece = square.figure
        const isWhite = piece.color === "white"
        let iconColor = ""
        if (selectedColor === "black") {
          iconColor = isWhite ? "text-black" : "text-white"
        } else {
          iconColor = isWhite ? "text-white" : "text-black"
        }

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
        let dropShadow
        if (selectedColor === "black") {
          dropShadow = isWhite ? "drop-shadow(0 0 6px #fff)" : "drop-shadow(0 0 6px #000)"
        } else {
          dropShadow = isWhite ? "drop-shadow(0 0 6px #000)" : "drop-shadow(0 0 6px #fff)"
        }

        return <IconComponent className={clsx("w-[60%] h-[60%] z-10", iconColor)} style={{ filter: dropShadow }} />
      }
    }

    if (!symbol) return null
    const isWhite = symbol === symbol.toUpperCase()
    let iconColor = ""
    if (selectedColor === "black") {
      iconColor = isWhite ? "text-black" : "text-white"
    } else {
      iconColor = isWhite ? "text-white" : "text-black"
    }
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
    let dropShadow
    if (selectedColor === "black") {
      dropShadow = isWhite ? "drop-shadow(0 0 6px #000)" : "drop-shadow(0 0 6px #fff)"
    } else {
      dropShadow = isWhite ? "drop-shadow(0 0 6px #fff)" : "drop-shadow(0 0 6px #000)"
    }
    return <IconComponent className={clsx("w-[60%] h-[60%] z-10", iconColor)} style={{ filter: dropShadow }} />
  }

  /**
   * renderArrows
   *
   * Funkcja renderująca strzałki na szachownicy na podstawie danych z hooka useChessArrows.
   *
   * @returns {JSX.Element[]} Lista elementów JSX reprezentujących strzałki.
   */
  function renderArrows() {
    const arrowColorSolid = "#ffa500" // Kolor strzałek
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

      const lineThickness = 18 // Grubość linii strzałki
      const arrowHeadSize = 40 // Rozmiar grotu strzałki

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
            <div style={diagonalSegmentStyle} /> {/* Segment diagonalny */}
            <div style={arrowHeadStyleDiagonal} /> {/* Grot strzałki */}
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
            {verticalHeight > 0 && <div style={verticalStyle} />} {/* Segment pionowy */}
            {horizontalWidth > 0 && <div style={horizontalStyle} />} {/* Segment poziomy */}
            <div style={cornerConnectorStyle} /> {/* Łącznik narożny */}
            <div style={arrowHeadStyleL} /> {/* Grot strzałki */}
          </div>
        )
      }
    })
  }

  // Renderowanie szachownicy
  return (
    <div className={`w-full max-w-[68vh] aspect-square ${modelsLoaded ? "relative" : "flex justify-center items-center"}`}>
      <div style={{ display: modelsLoaded ? "none" : "block" }}>
        <LoadingAnimation title={title} desc={desc}></LoadingAnimation> {/* Animacja ładowania */}
      </div>
      <div
        className={clsx("p-4 bg-white/30 rounded-3xl shadow-2xl", isDarkMode ? "bg-stone-600/30" : "bg-gray-300/30")}
        style={{ display: modelsLoaded ? "block" : "none" }}
      >
        <div className={clsx("relative z-10 w-full aspect-square rounded-xl shadow-2xl", isDarkMode ? "bg-stone-600" : "bg-gray-300")}>
          <div className="relative w-full h-full box-border">
            <div className="absolute inset-0 pointer-events-none">{renderArrows()}</div> {/* Warstwa strzałek */}
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

                  const squareBgClasses = isKingInCheck
                    ? "bg-red-500 hover:bg-red-600" // Pole króla w szachu
                    : isBlackSquare(rowIndex, colIndex, isDarkMode) // Standardowe tło pola

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
                            <div className="absolute inset-0 bg-green-600 opacity-40 pointer-events-none m-2 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md" /> // Pole bicia
                          ) : (
                            <div
                              className={clsx(
                                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[18%] h-[18%] rounded-full pointer-events-none",
                                isDarkMode ? "bg-white" : "bg-gray-600",
                              )}
                            /> // Wskaźnik możliwego ruchu
                          )}
                        </>
                      )}
                      {isEnPassantMove && (
                        <div
                          className={clsx(
                            "absolute inset-0 bg-yellow-500 opacity-50 pointer-events-none rounded-md",
                            "border-2 border-dashed border-yellow-700",
                          )}
                        /> // Wskaźnik bicia w przelocie
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 border-t-[5px] border-l-[5px] border-blue-500 pointer-events-none z-0 rounded-tl-md" /> // Wyróżnienie wybranego pola
                      )}
                      {renderPiece(symbol, rowIndex, colIndex)} {/* Figura szachowa */}
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
