import ChessGame from "@modules/chessGame"
import { Position, Board } from "@modules/utils/board"

export const isMoveValid = (board: Board, move: { from: Position; to: Position }): boolean => {
  return !!board?.getFigureAtPosition(move.from)?.isValidMove(move.to)
}
export const getValidMovesForPosition = (board: Board, from: Position): Position[] => {
  return board.getValidMovesForPosition(from)
}
