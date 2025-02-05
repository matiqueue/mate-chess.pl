import ChessGame from "@modules/chessGame"
import { Board, Position } from "@modules/utils/board"

export const makeMove = (game: ChessGame, move: { from: Position; to: Position }): boolean => {
  return !!game.board?.getFigureAtPosition(move.from)?.move(move.to)
}
