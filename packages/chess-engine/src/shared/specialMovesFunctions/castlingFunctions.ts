import { Position, Board } from "@/utils/board"
import ChessGame from "@/chessGame"

export const castleMove = (game: ChessGame, move: { from: Position; to: Position }) => {
  const figure = game.board?.getFigureAtPosition(move.from)
  if (figure?.type === "king" && figure?.isValidMove(move.to)) {
    figure.move(move.to)
  }
  return false
}
