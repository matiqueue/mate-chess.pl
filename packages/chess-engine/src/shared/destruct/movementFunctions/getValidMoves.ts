import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Position, Board } from "@utils/boardUtils"
import { Move } from "@shared/types/moveType"

export const isMoveValid = (board: Board, move: Move): boolean => {
  return !!board?.getFigureAtPosition(move.from)?.isMoveValid(move.to)
}
export const getValidMoves = (board: Board, from: Position): Position[] => {
  return board.getValidMovesForPosition(from)
}
export const whosTurn = (game: ChessGameExtraLayer): "white" | "black" => {
  return game?.currentPlayer
}
