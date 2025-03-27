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
  callAiToPerformMove,
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
  const [whiteTime, setWhiteTime] = useState<number>(300) // 5 minut dla białych
  const [blackTime, setBlackTime] = useState<number>(300) // 5 minut dla czarnych
  const [timeLeft, setTimeLeft] = useState<number>(600) // 10 minut ogólnego czasu

  // Inicjalizacja gry
  useEffect(() => {
    const newGame: ChessGameExtraAI | ChessGameExtraLayer = ai ? setupAIGame(color.Black) : setupGame()
    startGame(newGame)
    setGame(newGame)
    setBoard(getBoard(newGame))
    setCurrentPlayer(whosTurn(newGame))
    setMoveHistory(getMoveHistory(newGame))
    setGameStatus(getGameStatus(newGame))
    console.log("Initial game status:", getGameStatus(newGame))
    console.log("Initial current player:", whosTurn(newGame))
  }, [ai])

  // Timer dla ogólnego czasu gry
  useEffect(() => {
    const gameTimer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(gameTimer)
  }, [])

  // Timer dla czasu graczy z logiką końca czasu
  useEffect(() => {
    console.log("Player timer effect triggered. Game status:", gameStatus, "Current player:", currentPlayer)
    if (gameStatus !== gameStatusType.active) {
      console.log("Game not active, timer not started")
      return
    }

    const playerTimer = setInterval(() => {
      if (currentPlayer?.toLowerCase() === "white") {
        setWhiteTime((prevWhiteTime) => {
          const newTime = prevWhiteTime > 0 ? prevWhiteTime - 1 : 0
          if (newTime === 0) {
            setGameStatus(gameStatusType.blackWins)
          }
          return newTime
        })
      } else if (currentPlayer?.toLowerCase() === "black") {
        setBlackTime((prevBlackTime) => {
          const newTime = prevBlackTime > 0 ? prevBlackTime - 1 : 0
          if (newTime === 0) {
            setGameStatus(gameStatusType.whiteWins)
          }
          return newTime
        })
      } else {
        console.error("No valid current player detected")
      }
    }, 1000)

    return () => {
      console.log("Cleaning up player timer")
      clearInterval(playerTimer)
    }
  }, [currentPlayer, gameStatus])

  const movePiece = (from: any, to: any): boolean => {
    const move = { from, to }
    if (makeMove(game, move)) {
      updateBoard()
      return true
    }
    return false
  }

  const aiMovePerform = async () => {
    if (!(game instanceof ChessGameExtraAI)) throw new Error("Wrong game instance")
    if (game.aiColor === whosTurn(game)) {
      if (isAwaitingPromotion(game)) {
        game.promotionTo(figureType.queen)
        updateBoard()
      } else {
        try {
          const aimove = await callAiToPerformMove(game)
          if (aimove) {
            makeMove(game, aimove)
          } else {
            console.error("ai move not performed. Move is either undefined or null")
          }
          updateBoard()
        } catch (error) {
          console.error("Error during AI move:", error)
        }
      }
    }
  }

  useEffect(() => {
    aiMovePerform()
  }, [currentPlayer])

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
    whiteTime,
    blackTime,
    timeLeft,
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
    setGameStatus,
    aiMovePerform,
  }
}

export default useGame
