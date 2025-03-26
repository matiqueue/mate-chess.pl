import { useEffect, useState } from "react"
import {
  forwardMove,
  getBoard,
  getGameStatus,
  getMoveHistory,
  getPositionByCords,
  getPositionById,
  getPositionByNotation,
  getValidMoves,
  isAwaitingPromotion,
  isCheckmate,
  isMoveEnPassant,
  isPreviewModeOn,
  isStalemate,
  makeMove,
  promote,
  returnToCurrentState,
  rewindMove,
  setupAIGame,
  setupGame,
  startGame,
  undoMove,
  whosTurn,
} from "@modules/index"
import { color, figureType } from "@chess-engine/types"
import MovePair from "@shared/types/movePair"
import { gameStatusType } from "@shared/types/gameStatusType"
import ChessGameExtraAI from "@modules/chessGameExtraAI"
import ChessGameExtraLayer from "@modules/chessGameExtraLayer"

const useGame = (ai: boolean = false) => {
  const [game, setGame] = useState<any>(null)
  const [board, setBoard] = useState<any>(null)
  const [moveHistory, setMoveHistory] = useState<MovePair[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState<gameStatusType>(gameStatusType.paused)
  const [timeLeft, setTimeLeft] = useState<number>(600) // 10 minut w sekundach

  useEffect(() => {
    // Inicjalizacja gry
    const newGame: ChessGameExtraAI | ChessGameExtraLayer = ai ? setupAIGame(color.Black) : setupGame()
    startGame(newGame)
    setGame(newGame)
    setBoard(getBoard(newGame))
    setCurrentPlayer(whosTurn(newGame))
    setMoveHistory(getMoveHistory(newGame))
    setGameStatus(getGameStatus(newGame))

    // Uruchomienie licznika czasu
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    // Czyszczenie interwału przy unmount
    return () => clearInterval(timer)
  }, [])

  const movePiece = (from: any, to: any): boolean => {
    const move = { from, to }
    if (makeMove(game, move)) {
      updateBoard()
      return true
    }
    return false
  }

  const undoLastMove = (): boolean => {
    if (undoMove(game)) {
      updateBoard()
      return true
    }
    return false
  }

  const reviewLastMove = (): boolean => {
    if (rewindMove(game)) {
      updateBoard()
      return true
    }
    return false
  }

  const forwardLastMove = (): boolean => {
    if (forwardMove(game)) {
      updateBoard()
      return true
    }
    return false
  }

  const returnToCurrentGameState = () => {
    if (returnToCurrentState(game)) {
      updateBoard()
    }
  }

  const updateBoard = () => {
    console.log("update board called")
    setBoard(getBoard(game))
    setMoveHistory(getMoveHistory(game))
    setCurrentPlayer(whosTurn(game))
    setGameStatus(getGameStatus(game))
  }

  const promoteFigure = (figure: figureType.bishop | figureType.rook | figureType.queen | figureType.knight) => {
    promote(game, figure)
    updateBoard()
  }

  return {
    game,
    board,
    moveHistory,
    currentPlayer,
    gameStatus,
    timeLeft, // Eksport licznika czasu
    movePiece,
    undoLastMove,
    forwardLastMove,
    reviewLastMove,
    returnToCurrentGameState,
    promoteFigure,
    isAwaitingPromotion: () => isAwaitingPromotion(game),
    isMoveEnPassant: (position: any) => isMoveEnPassant(getBoard(game), position),
    isPreviewMode: () => isPreviewModeOn(game),
    getValidMoves: (position: any) => getValidMoves(getBoard(game), position),
    isCheckmate: () => isCheckmate(game),
    isStalemate: () => isStalemate(game),
    getPositionByCords: (x: number, y: number) => getPositionByCords(getBoard(game), x, y),
    getPositionByNotation: (notation: string) => getPositionByNotation(getBoard(game), notation),
    getPositionById: (id: number) => getPositionById(getBoard(game), id),
  }
}

export default useGame
