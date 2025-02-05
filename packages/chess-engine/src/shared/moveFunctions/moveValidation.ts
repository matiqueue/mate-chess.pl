import ChessGame from "@/chessGame"
import { Position, Board } from "@/utils/board"

export const isMoveValid = (game: ChessGame, move: { from: Position; to: Position }): boolean => {
  return !!game.board?.getFigureAtPosition(move.from)?.isValidMove(move.to)
}
