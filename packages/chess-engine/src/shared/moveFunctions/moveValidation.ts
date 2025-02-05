import ChessGame from "@modules/chessGame"
import { Position, Board } from "@modules/utils/board"

export const isMoveValid = (game: ChessGame, move: { from: Position; to: Position }): boolean => {
  return !!game.board?.getFigureAtPosition(move.from)?.isValidMove(move.to)
}
