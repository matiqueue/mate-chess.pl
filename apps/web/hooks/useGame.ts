/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import {
  setupGame,
  startGame,
  isCheckmate,
  getBoard,
  getValidMoves,
  whosTurn,
  makeMove,
  undoMove,
  getMoveHistory,
  isStalemate,
  getGameStatus,
  getPositionByCords,
  getPositionByNotation,
  getPositionById,
} from "@modules/index"

const useGame = () => {
  const [game, setGame] = useState<any>(null)
  const [board, setBoard] = useState<any>(null)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState<string>("stop")

  useEffect(() => {
    const newGame = setupGame()
    startGame(newGame)
    setGame(newGame)
    setBoard(getBoard(newGame))
    setCurrentPlayer(whosTurn(newGame))
    setMoveHistory(getMoveHistory(newGame))
    setGameStatus(getGameStatus(newGame))
  }, [])

  const movePiece = (from: any, to: any): boolean => {
    const move = { from, to }
    if (makeMove(game, move)) {
      setBoard(getBoard(game))
      setMoveHistory(getMoveHistory(game))
      setCurrentPlayer(whosTurn(game))
      setGameStatus(getGameStatus(game))
      return true
    }
    return false
  }

  const undoMove = (): boolean => {
    if (undoMove(game)) {
      setBoard(getBoard(game))
      setMoveHistory(getMoveHistory(game))
      setCurrentPlayer(whosTurn(game))
      setGameStatus(getGameStatus(game))
      return true
    }
    return false
  }

  return {
    game,
    board,
    moveHistory,
    currentPlayer,
    gameStatus,
    movePiece,
    undoMove,
    getValidMoves: (position: any) => getValidMoves(getBoard(game), position),
    isCheckmate: () => isCheckmate(game),
    isStalemate: () => isStalemate(game),
    // Dodajemy funkcje do pobierania pozycji – wykorzystując funkcje eksportowane z index
    getPositionByCords: (x: number, y: number) => getPositionByCords(getBoard(game), x, y),
    getPositionByNotation: (notation: string) => getPositionByNotation(getBoard(game), notation),
    getPositionById: (id: number) => getPositionById(getBoard(game), id),
  }
}

export default useGame
