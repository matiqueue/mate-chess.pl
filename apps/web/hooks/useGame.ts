// hooks/useGame.ts
import { useState, useEffect } from "react"
import {
  setupGame,
  startGame,
  isCheckmate,
  getBoard,
  getValidMoves,
  whosTurn,
  makeMove,
  rewindMove,
  getMoveHistory,
  isStalemate,
  getGameStatus,
} from "@modules/index" // Upewnij się, że ścieżka jest poprawna

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
    if (rewindMove(game)) {
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
  }
}

export default useGame
