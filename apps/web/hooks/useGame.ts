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

const useGame = (ai: boolean = false, selectedColor: string, timer: number) => {
  const [game, setGame] = useState<any>(null)
  const [board, setBoard] = useState<any>(null)
  const [moveHistory, setMoveHistory] = useState<MovePair[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState<gameStatusType>(gameStatusType.paused)
  const [initialTime, setInitialTime] = useState(timer)
  const [whiteTime, setWhiteTime] = useState<number>(timer) // x minut dla białych
  const [blackTime, setBlackTime] = useState<number>(timer) // x minut dla czarnych
  const [timeLeft, setTimeLeft] = useState<number>(timer*2) // 2x minut ogólnego czasu
  const [timestampWhite, setTimeStampWhite] = useState(Date.now())
  const [timestampBlack, setTimeStampBlack] = useState(Date.now())

  // Inicjalizacja gry
  useEffect(() => {
    const newGame: ChessGameExtraAI | ChessGameExtraLayer = ai ? setupAIGame(color.Black) : setupGame() //@TODO trzeba zrobić jakiegoś prompta żeby pobierało notacje fen i wklejało do setupGame. W tym promptcie musi być try catch, i jak złapie exception że nieprawidłowy fen to podświetlić na czerwono a nie crashować apke
    startGame(newGame)
    setGame(newGame)
    setBoard(getBoard(newGame))

    if(selectedColor == "black"){
      setCurrentPlayer("black")
    }else{
      setCurrentPlayer("white")
    }

    setTimeStampWhite(Date.now())
    setTimeStampBlack(Date.now())
    setCurrentPlayer("white")
    setMoveHistory(getMoveHistory(newGame))
    setGameStatus(getGameStatus(newGame))

    console.log("Initial game status:", getGameStatus(newGame))
    console.log("Initial current player:", whosTurn(newGame))
  }, [ai])


  // Timer dla czasu graczy z logiką końca czasu
  useEffect(() => {
    console.log("Player timer effect triggered. Game status:", gameStatus, "Current player:", currentPlayer)
    if (gameStatus !== gameStatusType.active) {
      console.log("Game not active, timer not started")
      return
    }
    const currentTimeStamp = Date.now()
    console.log("CurrentTurn: ", currentPlayer)
    if (currentPlayer?.toLowerCase() === "white") {
      setWhiteTime(() => {
        const newTime = (timestampWhite - currentTimeStamp) * -1 / 1000  - (initialTime - blackTime)
        return initialTime - Math.floor(newTime)
      });
      console.log("whitetime: ", whiteTime)
      if (whiteTime <= 0) {
        setGameStatus(gameStatusType.blackWins);
      }
    } else if (currentPlayer?.toLowerCase() === "black") {
      setBlackTime(() => {
        const newTime = (timestampBlack - currentTimeStamp) * -1 / 1000 - (initialTime - whiteTime )
        return initialTime - Math.floor(newTime)
      });
      console.log("blacktime: ", blackTime)
      if (blackTime <= 0) {
        setGameStatus(gameStatusType.whiteWins);
      }
    } else {
      console.error("No valid current player detected");
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
    if (game instanceof ChessGameExtraAI) {
      aiMovePerform()
    }
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
