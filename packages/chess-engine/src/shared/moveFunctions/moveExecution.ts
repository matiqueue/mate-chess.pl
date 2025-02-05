import ChessGame from "@/chessGame"
import { Board, Position } from "@/utils/board"

export const makeMove = (game: ChessGame, move: { from: Position; to: Position }): boolean => {
  return !!game.board?.getFigureAtPosition(move.from)?.move(move.to)
}
