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
  rewindMove,
  forwardMove,
  returnToCurrentState,
  isMoveEnPassant,
  promote,
  isAwaitingPromotion,
} from "@modules/index"
import { figureType } from "@chess-engine/types"
import MoveRecordPublic from "@modules/chess/history/move"
import MovePair from "@shared/types/movePair"

const useGame = () => {
  const [game, setGame] = useState<any>(null)
  const [board, setBoard] = useState<any>(null)
  const [moveHistory, setMoveHistory] = useState<MovePair[]>([])
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

  const undoLastMove = (): boolean => {
    if (undoMove(game)) {
      setBoard(getBoard(game))
      setMoveHistory(getMoveHistory(game))
      setCurrentPlayer(whosTurn(game))
      setGameStatus(getGameStatus(game))
      return true
    }
    return false
  }
  const reviewLastMove = (): boolean => {
    if (rewindMove(game)) {
      setBoard(getBoard(game))
      setMoveHistory(getMoveHistory(game))
      setCurrentPlayer(whosTurn(game))
      setGameStatus(getGameStatus(game))
      return true
    }
    return false
  }
  const forwardLastMove = (): boolean => {
    if (forwardMove(game)) {
      setBoard(getBoard(game))
      setMoveHistory(getMoveHistory(game))
      setCurrentPlayer(whosTurn(game))
      setGameStatus(getGameStatus(game))
      return true
    }
    return false
  }
  const returnToCurrentGameState = () => {
    if (returnToCurrentState(game)) {
      setBoard(getBoard(game))
      setMoveHistory(getMoveHistory(game))
      setCurrentPlayer(whosTurn(game))
      setGameStatus(getGameStatus(game))
    }
  }
  return {
    game,
    board,
    moveHistory,
    currentPlayer,
    gameStatus,
    movePiece,
    undoLastMove,
    forwardLastMove,
    reviewLastMove,
    returnToCurrentGameState,
    isAwaitingPromotion: () => isAwaitingPromotion(game),
    promote: (figure: figureType.bishop | figureType.rook | figureType.queen | figureType.knight) => promote(game, figure),
    isMoveEnPassant: (position: any) => isMoveEnPassant(getBoard(game), position),
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
