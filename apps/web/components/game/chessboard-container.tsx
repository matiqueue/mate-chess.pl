"use client"

import { useGameView } from "@/contexts/GameViewContext"
import { ChessBoard2D } from "./chessboards/chessboard-2D"
import { ChessBoard3D } from "./chessboards/chessboard-3D"

export default function ChessBoardContainer() {
  const { viewMode } = useGameView()

  return <>{viewMode === "2D" ? <ChessBoard2D /> : <ChessBoard3D />}</>
}
