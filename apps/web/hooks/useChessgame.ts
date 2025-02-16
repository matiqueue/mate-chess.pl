import { useState, useRef, useEffect } from "react"
import chessGameExtraLayer from "@modules/chessGameExtraLayer"
import { getBoard, getValidMoves, makeMove, rewindMove, setupGame, startGame, whosTurn } from "@modules/index"
import { getBoardArray } from "@shared/destruct/mallocFunctions/positonMapping"
import { color } from "@chess-engine/types"
import Position from "@modules/chess/position"
import Board from "@modules/chess/board/board"

export function useChessGame() {
  const [board, setBoard] = useState<Board>()
  const gameInstanceRef = useRef<chessGameExtraLayer>(setupGame())

  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [turn, setTurn] = useState<color>(whosTurn(gameInstanceRef.current))
  const [initialBoard, setInitialBoard] = useState(Array(8).fill(Array(8).fill("")))

  const updateData = (updatedBoard: Board) => {
    setBoard(updatedBoard)
    setInitialBoard(getBoardArray(updatedBoard))
    setTurn(whosTurn(gameInstanceRef.current))
  }
  // ODPALA SIE TYLKO RAZ, NA POCZĄTKU GRY
  useEffect(() => {
    if (!gameInstanceRef.current) {
      return
    }
    startGame(gameInstanceRef.current)
    const board = getBoard(gameInstanceRef.current)
    setBoard(board)
    setInitialBoard(getBoardArray(board))
    console.log(initialBoard)
  }, [])

  useEffect(() => {
    if (!board) return
    setInitialBoard(getBoardArray(board))
    return
    // reviewing required because ML is unsure if that's correct way to use useEffect.
    // previously there was [initalBoard] but it caused endless loop resulting in memory leak in browser
  }, [turn])

  const makeMoveHandler = (move: { from: Position; to: Position }) => {
    if (!board) return
    makeMove(gameInstanceRef.current, move)
    const updatedBoard = getBoard(gameInstanceRef.current)
    updateData(updatedBoard)
  }

  const rewindHandler = () => {
    rewindMove(gameInstanceRef.current)
    const updatedBoard = getBoard(gameInstanceRef.current)
    updateData(updatedBoard)
  }

  const getValidMovesHandler = (position: Position) => {
    if (!board) return []
    return getValidMoves(board, position)
  }
  return {
    board,
    turn,
    initialBoard,
    makeMove: makeMoveHandler,
    rewind: rewindHandler,
    getValidMoves: getValidMovesHandler,
    gameInstance: gameInstanceRef.current,
  }
}
