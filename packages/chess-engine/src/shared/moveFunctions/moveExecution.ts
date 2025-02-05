import ChessGame from "@modules/chessGame"
import { Board, Position } from "@modules/utils/board"

export const makeMove = (board: Board, move: { from: Position; to: Position }): boolean => {
  return !!board?.getFigureAtPosition(move.from)?.move(move.to)
}
